package org.datn.backend.domain.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "vouchers")
data class Voucher(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true, nullable = false)
    val code: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    val discountType: DiscountType,

    @Column(name = "discount_value", nullable = false)
    val discountValue: Double,

    @Column(name = "min_order_value")
    val minOrderValue: Double? = 0.0,

    @Column(name = "max_uses", nullable = false)
    val maxUses: Int,

    @Column(name = "used_count")
    var usedCount: Int = 0,

    @Column(name = "start_date", nullable = false)
    val startDate: LocalDateTime,

    @Column(name = "expiration_date", nullable = false)
    val expirationDate: LocalDateTime,

    @Column(name = "is_active")
    var isActive: Boolean = true
)