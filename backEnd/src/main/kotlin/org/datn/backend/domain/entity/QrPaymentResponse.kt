package org.datn.backend.domain.entity

data class QrPaymentResponse(
    val qrUrl: String,
    val amount: Long,
    val orderId: String,
    val description: String
)