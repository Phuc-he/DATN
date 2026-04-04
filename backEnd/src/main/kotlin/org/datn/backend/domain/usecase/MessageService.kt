package org.datn.backend.domain.usecase

import com.fasterxml.jackson.databind.ObjectMapper
import org.datn.backend.config.component.MessageWebSocketHandler
import org.datn.backend.domain.entity.Book
import org.datn.backend.domain.entity.LogAction
import org.datn.backend.domain.entity.Message
import org.datn.backend.domain.entity.MessageSender
import org.datn.backend.domain.repository.MessageRepository
import org.datn.backend.domain.repository.ModelMessageRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class MessageService(
    private val messageRepository: MessageRepository,
    private val modelMessageRepository: ModelMessageRepository,
    private val objectMapper: ObjectMapper,
    private val messageWebSocketHandler: MessageWebSocketHandler,
    private val activityLogService: ActivityLogService,
    private val bookService: BookService,
) {
    private val logger = LoggerFactory.getLogger(MessageService::class.java)

    @Transactional
    fun create(messageRequest: Message): Message? =
        activityLogService.executeWithLog(LogAction.CREATE.name, "Message") {
            val savedMessage = messageRepository.save(messageRequest)
            // Thông báo qua WebSocket nếu cần thiết khi tạo mới
            messageWebSocketHandler.sendMessage(objectMapper.writeValueAsString(savedMessage))
            savedMessage
        }

    /**
     * Cập nhật thông tin tin nhắn (Ví dụ: sửa nội dung hoặc gắn thêm sách liên quan)
     */
    @Transactional
    fun update(id: Long, updates: Map<String, Any>): Message? =
        activityLogService.executeWithLog(LogAction.UPDATE.name, "Message") {
            val existingMessage = messageRepository.findById(id)
                .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found") }
            // Cập nhật các field dựa trên Map (giống AuthorService)
            var updatedMessage: Message? = if (updates.containsKey("relatedBook")) {
                val bookMap = updates["relatedBook"] as? Map<*, *>

                if (bookMap != null) {
                    // Lấy ID từ trong LinkedHashMap (nhìn vào ảnh của bạn: "id" -> 1)
                    val bookId = (bookMap["id"] as? Number)?.toLong()

                    if (bookId != null) {
                        // QUAN TRỌNG: Phải tìm Book thực sự từ DB bằng ID này
                        existingMessage.copy(relatedBook = bookService.getById(bookId).orElse(null))
                    } else {
                        existingMessage.copy(relatedBook = null)
                    }
                } else {
                    // Nếu admin chọn null/None
                    existingMessage.copy(relatedBook = null)
                }
            } else {
                existingMessage.copy(relatedBook = null)
            }
            updatedMessage = updatedMessage?.copy(
                content = updates["content"] as? String ?: existingMessage.content,
                sender = updates["sender"] as? MessageSender ?: existingMessage.sender,
            )

            val result: Message? = updatedMessage?.let {
                messageRepository.save(it)
            }
            logger.info("id $id result ${result?.relatedBook} updatedMessage $updatedMessage existingMessage $existingMessage")
            // Gửi cập nhật qua WebSocket để UI đồng bộ thời gian thực
            runCatching {
                messageWebSocketHandler.sendMessage(objectMapper.writeValueAsString(result))
            }.onFailure {
                logger.error("", it)
            }
            result
        }

    /**
     * Xử lý yêu cầu chat từ người dùng.
     * Lưu tin nhắn user vào DB, sau đó gửi tới AI và lưu phản hồi của AI.
     */
    @Transactional
    suspend fun chatWithAI(userMessage: Message): Message =
        modelMessageRepository.request(messageRepository.save(userMessage).also {
            messageWebSocketHandler.sendMessage(objectMapper.writeValueAsString(it))
        }).also {
            messageWebSocketHandler.sendMessage(objectMapper.writeValueAsString(it))
        }

    /**
     * Kích hoạt quá trình huấn luyện/cập nhật tri thức cho AI
     */
    suspend fun trainAiModel(trainingData: List<String>) = modelMessageRepository.training(trainingData)

    /**
     * Tìm kiếm lịch sử tin nhắn (phục vụ Admin hoặc User tìm lại hội thoại)
     */
    fun search(query: String, pageable: Pageable): Page<Message> = messageRepository.search(query, pageable)

    /**
     * Lấy tất cả tin nhắn theo phân trang
     */
    fun getAll(pageable: Pageable): Page<Message> = messageRepository.findByPage(pageable)

    @Transactional
    fun delete(id: Long) = messageRepository.deleteById(id)


    fun getById(id: Long): Message? = messageRepository.findById(id).orElse(null)

    fun getMessagesByUserId(userId: Long): List<Message> = messageRepository.findByUserId(userId)
}