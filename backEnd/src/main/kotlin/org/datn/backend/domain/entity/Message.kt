package org.datn.backend.domain.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "messages")
data class Message(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    val user: User?,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val sender: MessageSender,

    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    val content: String,

    /**
     * Lưu trữ ID của cuốn sách được nhắc đến (nếu có)
     * để dễ dàng hiển thị link sản phẩm ở Frontend.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_book_id")
    val relatedBook: Book? = null,

    @CreationTimestamp
    val createdAt: LocalDateTime? = null
)