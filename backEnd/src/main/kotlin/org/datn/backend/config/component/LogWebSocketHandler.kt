package org.datn.backend.config.component

import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.util.Collections
import java.util.concurrent.ConcurrentHashMap

@Component
class LogWebSocketHandler : TextWebSocketHandler() {
    // Store all active admin dashboard sessions
    private val adminSessions = Collections.newSetFromMap(ConcurrentHashMap<WebSocketSession, Boolean>())

    override fun afterConnectionEstablished(session: WebSocketSession) {
        adminSessions.add(session)
        println("Admin Dashboard connected: ${session.id}")
    }

    override fun afterConnectionClosed(
        session: WebSocketSession,
        status: CloseStatus,
    ) {
        adminSessions.remove(session)
        println("Admin Dashboard disconnected: ${session.id}")
    }

    /**
     * Broadcasts a new activity log to all connected admin dashboards.
     * Usually called from ActivityLogService after a successful DB save.
     */
    fun broadcastLog(logJson: String) {
        adminSessions.forEach { session ->
            if (session.isOpen) {
                try {
                    session.sendMessage(TextMessage(logJson))
                } catch (e: Exception) {
                    println("Error sending log to session ${session.id}: ${e.message}")
                }
            }
        }
    }
}
