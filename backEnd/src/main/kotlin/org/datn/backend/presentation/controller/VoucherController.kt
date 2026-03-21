package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.DiscountType
import org.datn.backend.domain.entity.Voucher
import org.datn.backend.domain.usecase.VoucherService
import org.datn.backend.proto.DiscountTypeProto
import org.datn.backend.proto.VoucherPageResponse
import org.datn.backend.proto.VoucherProto
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.OffsetDateTime

@RestController
@RequestMapping("/api/vouchers")
class VoucherController(private val voucherService: VoucherService) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<VoucherPageResponse> {
        val page = voucherService.getAll(pageable)
        log.info("page: ${page.content}")
        log.info("pageable: $pageable")
        return ResponseEntity.ok(toPageResponse(page))
    }

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(
        @RequestParam query: String,
        pageable: Pageable
    ): ResponseEntity<VoucherPageResponse> {
        val page = voucherService.search(query, pageable)
        return ResponseEntity.ok(toPageResponse(page))
    }

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(@PathVariable id: Long): ResponseEntity<VoucherProto> {
        val voucher = voucherService.findById(id)
        return ResponseEntity.ok(toProto(voucher))
    }

    @GetMapping("/validate", produces = ["application/x-protobuf"])
    fun validateVoucher(
        @RequestParam code: String,
        @RequestParam amount: Double
    ): ResponseEntity<VoucherProto> {
        val voucher = voucherService.validateVoucher(code, amount)
        return ResponseEntity.ok(toProto(voucher))
    }

    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun create(@RequestBody proto: VoucherProto): ResponseEntity<VoucherProto> {
        val savedVoucher = voucherService.create(
            Voucher(
                id = if (proto.id != 0L) proto.id else null, // Handle long to nullable Long
                code = proto.code,

                // Map Enum: Proto uses the generated Enum type
                discountType = DiscountType.entries[proto.discountTypeValue],

                discountValue = proto.discountValue,
                minOrderValue = proto.minOrderValue,
                maxUses = proto.maxUses,
                usedCount = proto.usedCount,

                // Dates are already strings in your Proto definition
                startDate = OffsetDateTime.parse(proto.startDate).toLocalDateTime(),
                expirationDate = OffsetDateTime.parse(proto.expirationDate).toLocalDateTime(),

                isActive = proto.isActive
            )
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(toProto(savedVoucher))
    }

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<VoucherProto> {
        log.info("updating $id $updates")
        val updatedUser = voucherService.update(id, updates)
        return ResponseEntity.ok(toProto(updatedUser))
    }

    // --- Mapper Helpers ---

    private fun toProto(entity: Voucher): VoucherProto {
        return VoucherProto.newBuilder()
            .setId(entity.id ?: 0L)
            .setCode(entity.code)
            .setDiscountType(DiscountTypeProto.valueOf(entity.discountType.name))
            .setDiscountValue(entity.discountValue)
            .setMinOrderValue(entity.minOrderValue ?: 0.0)
            .setMaxUses(entity.maxUses)
            .setUsedCount(entity.usedCount)
            .setStartDate(entity.startDate.toString())
            .setExpirationDate(entity.expirationDate.toString())
            .setIsActive(entity.isActive)
            .build()
    }

    private fun toPageResponse(page: Page<Voucher>): VoucherPageResponse {
        return VoucherPageResponse.newBuilder()
            .addAllContent(page.content.map { toProto(it) })
            .setTotalPages(page.totalPages)
            .setTotalElements(page.totalElements)
            .build()
    }
}