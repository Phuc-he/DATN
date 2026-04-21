package org.datn.backend.domain.usecase

import org.datn.backend.config.component.LogWebSocketHandler
import org.datn.backend.domain.entity.ActivityLog
import org.datn.backend.domain.repository.ActivityLogRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class ActivityLogService(
    private val activityLogRepository: ActivityLogRepository,
    private val logWebSocketHandler: LogWebSocketHandler,
    private val objectMapper: com.fasterxml.jackson.databind.ObjectMapper,
) {
    private val logger = LoggerFactory.getLogger(ActivityLogService::class.java)

    fun getAll(): List<ActivityLog> = activityLogRepository.findAll()

    fun getAll(pageable: Pageable): Page<ActivityLog> = activityLogRepository.findAllByOrderByIdDesc(pageable)

    fun search(
        query: String,
        pageable: Pageable,
    ): Page<ActivityLog> = activityLogRepository.search(query, pageable)

    fun create(activityLog: ActivityLog): ActivityLog {
        val savedLog = activityLogRepository.save(activityLog)

        // Push to WebSocket immediately
        runCatching {
            val json = objectMapper.writeValueAsString(savedLog)
            logWebSocketHandler.broadcastLog(json)
        }.onFailure {
            logger.error(it.message, it)
        }

        return savedLog
    }

    fun update(
        id: Long,
        updates: Map<String, Any>,
    ): ActivityLog {
        val existingAuthor =
            activityLogRepository
                .findById(id)
                .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }

        // Logic to update only specific fields like 'bio' or 'profileImage'
        val updatedAuthor =
            existingAuthor.copy(
                action = updates["action"] as? String ?: existingAuthor.action,
            )
        return activityLogRepository.save(updatedAuthor)
    }

    fun delete(id: Long) {
        val author =
            activityLogRepository
                .findById(id)
                .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }

        // Custom check: If this author has books, prevent deletion or handle cascade
        // (This would involve calling bookRepository.countByAuthorId(id))

        activityLogRepository.delete(author)
    }

    // Helper function to wrap logic with automatic Activity Logging
    fun <T> executeWithLog(
        action: String,
        entityName: String,
        performedBy: String = "Server",
        block: () -> T,
    ): T? =
        runCatching {
            block()
        }.onSuccess { result ->
            val details =
                when (result) {
                    is List<*> -> "Đã lấy danh sách $entityName thành công (Số lượng: ${result.size})"
                    is Collection<*> -> "Đã lấy tập hợp $entityName thành công (Số lượng: ${result.size})"
                    null -> "Đã thực hiện $action trên $entityName (Kết quả: null)"
                    else -> "Đã thực hiện $action trên $entityName thành công"
                }

            create(
                ActivityLog(
                    action = action,
                    entityName = entityName,
                    details = details,
                    performedBy = performedBy,
                ),
            )
        }.onFailure { exception ->
            logger.error("", exception)
            create(
                ActivityLog(
                    action = "${action}_FAILURE",
                    entityName = entityName,
                    details = "Error during $action: ${exception.message}",
                    performedBy = performedBy,
                ),
            )
        }.getOrNull()
}
