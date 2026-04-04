package org.datn.backend.config

import org.datn.backend.config.component.LogWebSocketHandler
import org.datn.backend.config.component.MessageWebSocketHandler
import org.datn.backend.config.component.PaymentWebSocketHandler
import org.datn.backend.config.component.TrainWebSocketHandler
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry

@Configuration
@EnableWebSocket
class WebSocketConfig(
    private val paymentHandler: PaymentWebSocketHandler,
    private val logHandler: LogWebSocketHandler,
    private val trainHandler: TrainWebSocketHandler,
    private val messageHandler: MessageWebSocketHandler,
) : WebSocketConfigurer {
    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry
            .addHandler(paymentHandler, "/payment-status")
            .setAllowedOrigins("*") // Cần thiết để tránh lỗi CORS từ React

        registry
            .addHandler(logHandler, "/activity-logs")
            .setAllowedOrigins("*")

        registry
            .addHandler(trainHandler, "/train")
            .setAllowedOrigins("*")

        registry
            .addHandler(messageHandler, "/message")
            .setAllowedOrigins("*")
    }
}
