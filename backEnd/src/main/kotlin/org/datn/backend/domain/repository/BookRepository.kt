package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.Book
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface BookRepository : BaseRepository<Book, Long> {
    override fun findByPage(pageable: Pageable): Page<Book> = findAll(pageable)

    // Implementation for the abstract search
    @Query("SELECT b FROM Book b WHERE b.title LIKE %:query% OR b.description LIKE %:query%")
    override fun search(
        @Param("query") query: String,
        pageable: Pageable,
    ): Page<Book>

    // You can add custom query methods here
    fun findByAuthorId(
        authorId: Long,
        pageable: Pageable,
    ): Page<Book>

    fun countByCategoryId(id: Long): Long
}
