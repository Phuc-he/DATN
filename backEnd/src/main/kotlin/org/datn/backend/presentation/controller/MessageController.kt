package org.datn.backend.presentation.controller

import org.datn.backend.config.component.TrainWebSocketHandler
import org.datn.backend.domain.entity.Message
import org.datn.backend.domain.entity.MessageSender
import org.datn.backend.domain.usecase.*
import org.datn.backend.presentation.mapper.toPageResponse
import org.datn.backend.presentation.mapper.toProto
import org.datn.backend.proto.MessageResponsePageResponse
import org.datn.backend.proto.MessageResponseProto
import org.datn.backend.proto.MessageResponseProtoList
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/messages")
class MessageController(
    private val messageService: MessageService,
    private val trainWebSocketHandler: TrainWebSocketHandler,
    private val authorService: AuthorService,
    private val bookService: BookService,
    private val voucherService: VoucherService,
    private val userService: UserService,
) {
    /**
     * Lấy tất cả tin nhắn phân trang (Dùng cho Admin Table)
     */
    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<MessageResponsePageResponse> =
        ResponseEntity.ok(messageService.getAll(pageable).toPageResponse())

    /**
     * Tạo mới tin nhắn thủ công (Protobuf)
     */
    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun create(
        @RequestBody request: MessageResponseProto,
    ): ResponseEntity<MessageResponseProto> {
        val userEntity =
            if (request.hasUser()) {
                userService.getById(request.user.id)
            } else {
                null
            }

        // 2. Tìm Book thật từ DB (tương tự User)
        val bookEntity =
            if (request.hasRelatedBook()) {
                bookService.getById(request.relatedBook.id).orElse(null)
            } else {
                null
            }

        val message =
            Message(
                user = userEntity,
                sender = MessageSender.valueOf(request.sender.name),
                content = request.content,
                relatedBook = bookEntity,
                // relatedBook mapping logic if exists in your proto
            )
        return ResponseEntity.ok(messageService.create(message)?.toProto())
    }

    /**
     * Cập nhật tin nhắn (Partial Update)
     * Dùng JSON Map để khớp với logic Service hiện tại của bạn
     */
    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>,
    ): ResponseEntity<MessageResponseProto> = ResponseEntity.ok(messageService.update(id, updates)?.toProto())

    /**
     * API Chat chính: Nhận tin nhắn Protobuf và trả về phản hồi của AI
     */
    @PostMapping("/chat", consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    suspend fun chat(
        @RequestBody request: MessageResponseProto,
    ): ResponseEntity<MessageResponseProto> {
        val managedUser =
            request.user?.id?.let { userId ->
                userService.getById(userId)
            }
        return ResponseEntity.ok(
            messageService
                .chatWithAI(
                    Message(
                        user = managedUser,
                        sender = MessageSender.USER,
                        content = request.content,
                    ),
                ).toProto(),
        )
    }

    /**
     * API Huấn luyện: Gửi danh sách dữ liệu để AI học
     */
    @PostMapping("/train")
    suspend fun train(): ResponseEntity<Unit> {
        messageService
            .trainAiModel(
                buildList {
                    // Kiến thức về Tác giả
                    addAll(
                        authorService.getAll().map {
//                val text = "Tác giả: ${it.name}, Tiểu sử: ${it.bio}"
                            """{"instruction": "Khi khách hàng hỏi về tác giả ${it.name}", "input": "Tác giả này là ai?", "output": "Đây là ${it.name}. ${it.bio}"}"""
                                .replace(
                                    "\n",
                                    "",
                                )
                        },
                    )

                    // Kiến thức về Sách
                    addAll(
                        bookService.getAll().map {
//                val text = "Sách: ${it.title}, Giá: ${it.price}, Mô tả: ${it.description}"
                            """{"instruction": "Thông tin chi tiết về sách ${it.title}", "input": "Cuốn sách ${it.title} có gì đặc biệt?", "output": "Cuốn sách này có giá ${it.price}. Mô tả: ${it.description}"}"""
                                .replace(
                                    "\n",
                                    "",
                                )
                        },
                    )

                    // QUAN TRỌNG: Kiến thức về Voucher (Fix lỗi mã giảm giá)
                    addAll(
                        voucherService.getAll().map {
//                val text = "Mã giảm giá: ${it.code}, Giảm: ${it.discountValue}, Đơn tối thiểu: ${it.minOrderValue}"
                            """{"instruction": "Kiểm tra mã giảm giá ${it.code}", "input": "Tôi có mã ${it.code}, nó dùng như thế nào?", "output": "Mã ${it.code} là mã giảm giá trị giá ${it.discountValue}, áp dụng cho đơn hàng tối thiểu từ ${it.minOrderValue}."}"""
                                .replace(
                                    "\n",
                                    "",
                                )
                        },
                    )
                },
            ).collect {
                trainWebSocketHandler.sendMessage(it)
            }
        return ResponseEntity.noContent().build()
    }


    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(
        @RequestParam query: String,
        pageable: Pageable,
    ): ResponseEntity<MessageResponsePageResponse> = ResponseEntity.ok(messageService.search(query, pageable).toPageResponse())

    @DeleteMapping("/{id}")
    fun delete(
        @PathVariable id: Long,
    ): ResponseEntity<Unit> {
        messageService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/user/{userId}", produces = ["application/x-protobuf"])
    fun getChatHistory(
        @PathVariable userId: Long,
    ): ResponseEntity<MessageResponseProtoList> =
        ResponseEntity.ok(
            MessageResponseProtoList
                .newBuilder()
                .addAllData(messageService.getMessagesByUserId(userId).map { it.toProto() })
                .build(),
        )
}
