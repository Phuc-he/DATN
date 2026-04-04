package org.datn.backend.presentation.controller

import org.datn.backend.config.component.PaymentWebSocketHandler
import org.datn.backend.domain.entity.OrderStatus
import org.datn.backend.domain.usecase.OrderService
import org.datn.backend.presentation.mapper.toProto
import org.datn.backend.presentation.service.PaymentService
import org.datn.backend.proto.QrPaymentResponseProto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/payments")
class PaymentController(
    private val paymentService: PaymentService,
    private val paymentHandler: PaymentWebSocketHandler,
    private val orderService: OrderService,
) {
    // In PaymentController.kt
    @GetMapping("/generate/{orderId}", produces = ["application/x-protobuf"])
    fun getPaymentQr(
        @PathVariable orderId: String,
        @RequestParam amount: Long,
    ): ResponseEntity<QrPaymentResponseProto> = ResponseEntity.ok(paymentService.generateQrCode(orderId, amount).toProto())

    /**
     * POST /api/payments/webhook
     * Simulates receiving a notification from a payment gateway (VietQR/VNPay).
     */
    @PostMapping("/webhook")
    fun handlePaymentWebhook(
        @RequestBody body: Map<String, Any>,
    ): ResponseEntity<Map<String, Any>> {
        val content = body["content"] as? String ?: ""

        // Giả sử mã đơn hàng của bạn chỉ gồm số (Long)
        val orderIdRegex = Regex("""(\d+)$""")
        val orderIdStr = orderIdRegex.find(content)?.value

        if (orderIdStr != null) {
            val orderIdLong = orderIdStr.toLong()
            // Cập nhật DB
            orderService.updateStatus(orderIdLong, OrderStatus.PAID.ordinal.toString())
            // Gửi qua socket (Dùng chuỗi gốc để tìm Room)
            paymentHandler.notifyPaymentSuccess(orderIdStr)

            return ResponseEntity.ok(mapOf("status" to "success"))
        }
        return ResponseEntity.badRequest().build()
    }
}
