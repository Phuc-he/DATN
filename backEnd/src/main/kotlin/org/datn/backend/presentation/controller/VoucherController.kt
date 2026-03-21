package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.Voucher
import org.datn.backend.domain.usecase.VoucherService
import org.datn.backend.proto.DiscountTypeProto
import org.datn.backend.proto.VoucherPageResponse
import org.datn.backend.proto.VoucherProto
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/vouchers")
class VoucherController(private val voucherService: VoucherService) {

    @GetMapping(produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<VoucherPageResponse> {
        val page = voucherService.getAll(pageable)
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

    @PostMapping(consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun create(@RequestBody voucher: Voucher): ResponseEntity<VoucherProto> {
        val savedVoucher = voucherService.create(voucher)
        return ResponseEntity.status(HttpStatus.CREATED).body(toProto(savedVoucher))
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

    private fun toPageResponse(page: org.springframework.data.domain.Page<Voucher>): VoucherPageResponse {
        return VoucherPageResponse.newBuilder()
            .addAllVouchers(page.content.map { toProto(it) })
            .setTotalPages(page.totalPages)
            .setTotalElements(page.totalElements)
            .build()
    }
}