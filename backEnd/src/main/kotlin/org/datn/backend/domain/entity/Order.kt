package org.datn.backend.domain.entity

import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.math.BigDecimal

@Entity
@Table(name = "orders")
data class Order(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    val fullName: String,
    val phone: String,
    val address: String,
    val cartId: String? = null,
    val totalAmount: BigDecimal,

    @Enumerated(EnumType.STRING)
    val status: OrderStatus = OrderStatus.UNPROCESSED,

    @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL])
    val items: MutableList<OrderItem> = mutableListOf()
)