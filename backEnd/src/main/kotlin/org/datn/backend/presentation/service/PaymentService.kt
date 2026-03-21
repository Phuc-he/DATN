package org.datn.backend.presentation.service

import org.datn.backend.domain.entity.QrPaymentResponse
import org.springframework.stereotype.Service
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@Service
class PaymentService {

    fun generateQrCode(orderId: String, amount: Long): QrPaymentResponse {
        val description = "Thanh toan don hang $orderId"

        // Encode parameters for the URL to handle spaces and special characters
        val encodedDescription = URLEncoder.encode(description, StandardCharsets.UTF_8.toString())
        val encodedName = URLEncoder.encode(ACCOUNT_NAME, StandardCharsets.UTF_8.toString())

        // Build the VietQR URL using the 'qr_only' template
        val qrUrl = "https://img.vietqr.io/image/$VCB_BANK_ID-$ACCOUNT_NO-qr_only.png" +
                "?amount=$amount" +
                "&addInfo=$encodedDescription" +
                "&accountName=$encodedName"

        return QrPaymentResponse(
            qrUrl = qrUrl,
            amount = amount,
            orderId = orderId,
            description = description
        )
    }

    companion object {
        private const val VCB_BANK_ID = "970436" // Vietcombank BIN
        private const val ACCOUNT_NO = "1234567890" // Your VCB Account Number
        private const val ACCOUNT_NAME = "Phuc" // Account Holder Name
    }
}