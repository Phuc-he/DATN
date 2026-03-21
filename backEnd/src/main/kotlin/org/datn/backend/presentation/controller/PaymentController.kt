package org.datn.backend.presentation.controller

import org.datn.backend.config.component.PaymentWebSocketHandler
import org.datn.backend.domain.entity.OrderStatus
import org.datn.backend.domain.usecase.OrderService
import org.datn.backend.presentation.service.PaymentService
import org.datn.backend.proto.QrPaymentResponseProto
import org.springframework.http.HttpStatus
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
        @RequestParam amount: Long
    ): ResponseEntity<QrPaymentResponseProto> {
        val response = paymentService.generateQrCode(orderId, amount)

        // Convert your Data Class to Proto Builder
        val proto = QrPaymentResponseProto.newBuilder()
            .setQrUrl(response.qrUrl)
            .setAmount(response.amount)
            .setOrderId(response.orderId)
            .setDescription(response.description)
            .build()

        return ResponseEntity.ok(proto)
    }

    /**
     * POST /api/payments/webhook
     * Simulates receiving a notification from a payment gateway (VietQR/VNPay).
     */
    @PostMapping("/webhook")
    fun handlePaymentWebhook(@RequestBody body: Map<String, Any>): ResponseEntity<Map<String, Any>> {
        println("--- Nhận dữ liệu thanh toán giả lập --- $body")

        val content = body["content"] as? String ?: return ResponseEntity
            .badRequest()
            .body(mapOf("status" to "error", "message" to "Nội dung chuyển khoản trống"))

        val amount = body["amount"]

        // 1. Regex to extract Order ID (assuming it's at the end of the content)
        // Example: "Thanh toan don hang DH12345" -> matches "DH12345"
        val orderIdRegex = Regex("""(\w+)$""")
        val orderId = orderIdRegex.find(content)?.value

        if (orderId != null) {
            println("Tìm thấy mã đơn hàng: $orderId, Số tiền: $amount")

            orderService.updateStatus(orderId.toLong(), OrderStatus.PAID.name)

            // 3. Notify Frontend via WebSocket (Real-time)
            paymentHandler.notifyPaymentSuccess(orderId)

            return ResponseEntity.ok(
                mapOf(
                    "status" to "success",
                    "orderId" to orderId,
                    "message" to "Cập nhật trạng thái thanh toán thành công"
                )
            )
        }

        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(mapOf("status" to "error", "message" to "Không tìm thấy mã đơn hàng hợp lệ"))
    }
}