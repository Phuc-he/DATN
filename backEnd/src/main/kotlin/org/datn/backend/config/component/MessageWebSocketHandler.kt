package org.datn.backend.config.component

import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.util.Collections
import java.util.concurrent.ConcurrentHashMap

@Component
class MessageWebSocketHandler : TextWebSocketHandler() {
    // Sử dụng CopyOnWriteArrayList để an toàn khi đa luồng (nhiều người cùng xem log)
    private val sessions = Collections.newSetFromMap(ConcurrentHashMap<WebSocketSession, Boolean>())

    override fun afterConnectionEstablished(session: WebSocketSession) {
        sessions.add(session)
    }

    override fun afterConnectionClosed(
        session: WebSocketSession,
        status: CloseStatus,
    ) {
        sessions.remove(session)
    }

    /**
     * Hàm này dùng để đẩy log từ Service/Controller tới tất cả Client đang kết nối
     */
    fun sendMessage(message: String) {
        sessions.forEach { session ->
            if (session.isOpen) {
                session.sendMessage(TextMessage(message))
            }
        }
    }
}
