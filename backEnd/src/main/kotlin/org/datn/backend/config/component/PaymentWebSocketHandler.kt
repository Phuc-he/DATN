package org.datn.backend.config.component

import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.util.concurrent.ConcurrentHashMap

@Component
class PaymentWebSocketHandler : TextWebSocketHandler() {

    // Simulating "Rooms": Map<OrderId, Set<WebSocketSession>>
    private val orderRooms = ConcurrentHashMap<String, MutableSet<WebSocketSession>>()

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        // Cleanup: remove session from all rooms on disconnect
        orderRooms.values.forEach { it.remove(session) }
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        val payload = message.payload // Expected format: "joinOrderRoom:ORD123"

        if (payload.startsWith("joinOrderRoom:")) {
            val orderId = payload.substringAfter("joinOrderRoom:")

            orderRooms.computeIfAbsent(orderId) { ConcurrentHashMap.newKeySet() }.add(session)
            println("Client ${session.id} joined room: $orderId")

            session.sendMessage(TextMessage("Joined room: $orderId"))
        }
    }

    /**
     * Call this method from your Payment Webhook/Service
     * to notify the frontend that payment is successful.
     */
    fun notifyPaymentSuccess(orderId: String) {
        val sessions = orderRooms[orderId]
        sessions?.forEach { session ->
            if (session.isOpen) {
                session.sendMessage(TextMessage("PAYMENT_SUCCESS"))
            }
        }
    }
}