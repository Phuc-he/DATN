package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.Message
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface MessageRepository : BaseRepository<Message, Long> {
    override fun findByPage(pageable: Pageable): Page<Message> = findAll(pageable)

    fun findAllByOrderByIdDesc(pageable: Pageable): Page<Message>

    @Query(
        value = """
            SELECT m.* FROM messages m
            LEFT JOIN users u ON m.user_id = u.id
            LEFT JOIN books b ON m.related_book_id = b.id
            WHERE m.content LIKE %:query%
               OR u.full_name LIKE %:query%
               OR b.title LIKE %:query%
        """,
        countQuery = "SELECT count(*) FROM messages m",
        nativeQuery = true,
    )
    override fun search(
        @Param("query") query: String,
        pageable: Pageable,
    ): Page<Message>

    @Query(
        "SELECT m FROM Message m LEFT JOIN FETCH m.user LEFT JOIN FETCH m.relatedBook WHERE m.user.id = :userId ORDER BY m.createdAt ASC",
    )
    fun findByUserId(
        @Param("userId") userId: Long,
    ): List<Message>
}
