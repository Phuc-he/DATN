package org.datn.backend.config

import org.datn.backend.config.component.PaymentWebSocketHandler
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry

@Configuration
@org.springframework.web.socket.config.annotation.EnableWebSocket
class WebSocketConfig(private val paymentHandler: PaymentWebSocketHandler) : WebSocketConfigurer {

    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry.addHandler(paymentHandler, "/ws/payment")
            .setAllowedOrigins("*") // Matching your NestJS CORS config
    }
}