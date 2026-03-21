package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.Voucher
import org.datn.backend.domain.entity.DiscountType
import org.datn.backend.domain.repository.VoucherRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZonedDateTime

@Service
class VoucherService(private val voucherRepository: VoucherRepository) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun getAll(): List<Voucher> = voucherRepository.findAll()

    fun getAll(pageable: Pageable): Page<Voucher> = voucherRepository.findByPage(pageable)

    fun search(query: String, pageable: Pageable): Page<Voucher> = voucherRepository.search(query, pageable)

    fun findById(id: Long): Voucher = voucherRepository.findById(id)
        .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Voucher not found") }

    fun create(voucher: Voucher): Voucher {
        // Validation: Prevent duplicate codes
        if (voucherRepository.findByCodeAndIsActiveTrue(voucher.code) != null) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Voucher code '${voucher.code}' already exists and is active")
        }
        return voucherRepository.save(voucher)
    }

    /**
     * Partial update logic for Vouchers (e.g., toggling status or extending expiration)
     */
    fun update(id: Long, updates: Map<String, Any>): Voucher {
        val existing = findById(id)
        val dateParser = { input: String ->
            try {
                // Try parsing with Offset first (handles "2026...Z")
                ZonedDateTime.parse(input).toLocalDateTime()
            } catch (e: Exception) {
                // Fallback to Local (handles "2026...639" without Z)
                LocalDateTime.parse(input)
            }
        }
        // Using .copy() assuming Voucher is a data class
        val updated = existing.copy(
            usedCount = updates["usedCount"] as? Int ?: existing.usedCount,
            code = updates["code"] as? String ?: existing.code,
            isActive = updates["isActive"] as? Boolean ?: existing.isActive,
            maxUses = updates["maxUses"] as? Int ?: existing.maxUses,
            discountType = DiscountType.entries[updates["discountType"] as? Int ?: 0],
            discountValue = (updates["discountValue"] as? Number)?.toDouble() ?: existing.discountValue,
            minOrderValue = (updates["minOrderValue"] as? Number)?.toDouble() ?: existing.minOrderValue,
            startDate = (updates["startDate"] as? String)?.let { dateParser(it) } ?: existing.startDate,
            expirationDate = (updates["expirationDate"] as? String)?.let { dateParser(it) } ?: existing.expirationDate
        )
        log.info("updated $updated")
        return voucherRepository.save(updated)
    }

    /**
     * Business Logic: Validate if a voucher can be applied to an order
     */
    fun validateVoucher(code: String, orderAmount: Double): Voucher {
        val voucher = voucherRepository.findByCodeAndIsActiveTrue(code)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Voucher is invalid or expired")

        val now = LocalDateTime.now()

        if (now.isBefore(voucher.startDate) || now.isAfter(voucher.expirationDate)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Voucher is not in its valid date range")
        }

        if (voucher.usedCount >= voucher.maxUses) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Voucher has reached its usage limit")
        }

        if (orderAmount < (voucher.minOrderValue ?: 0.0)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Minimum order value of ${voucher.minOrderValue} not met")
        }

        return voucher
    }

    fun delete(id: Long) {
        if (!voucherRepository.existsById(id)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
        voucherRepository.deleteById(id)
    }
}