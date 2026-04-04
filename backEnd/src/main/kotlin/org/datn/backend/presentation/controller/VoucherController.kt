package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.DiscountType
import org.datn.backend.domain.entity.Voucher
import org.datn.backend.domain.usecase.VoucherService
import org.datn.backend.presentation.mapper.toPageResponse
import org.datn.backend.presentation.mapper.toProto
import org.datn.backend.proto.VoucherPageResponse
import org.datn.backend.proto.VoucherProto
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.OffsetDateTime

@RestController
@RequestMapping("/api/vouchers")
class VoucherController(
    private val voucherService: VoucherService,
) {
    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<VoucherPageResponse> =
        ResponseEntity.ok(voucherService.getAll(pageable).toPageResponse())

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(
        @RequestParam query: String,
        pageable: Pageable,
    ): ResponseEntity<VoucherPageResponse> = ResponseEntity.ok(voucherService.search(query, pageable).toPageResponse())

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(
        @PathVariable id: Long,
    ): ResponseEntity<VoucherProto> = ResponseEntity.ok(voucherService.findById(id).toProto())

    @GetMapping("/validate", produces = ["application/x-protobuf"])
    fun validateVoucher(
        @RequestParam code: String,
        @RequestParam amount: Double,
    ): ResponseEntity<VoucherProto> = ResponseEntity.ok(voucherService.validateVoucher(code, amount).toProto())

    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun create(
        @RequestBody proto: VoucherProto,
    ): ResponseEntity<VoucherProto> {
        val savedVoucher =
            voucherService.create(
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
                    isActive = proto.isActive,
                ),
            )
        return ResponseEntity.status(HttpStatus.CREATED).body(savedVoucher?.toProto())
    }

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>,
    ): ResponseEntity<VoucherProto> = ResponseEntity.ok(voucherService.update(id, updates)?.toProto())
}
