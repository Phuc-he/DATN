package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.Category
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface CategoryRepository : BaseRepository<Category, Long> {
    @Query("SELECT c FROM Category c WHERE c.isDeleted = false")
    override fun findByPage(pageable: Pageable): Page<Category>

    @Query(
        """
        SELECT c FROM Category c
        WHERE (LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')))
        AND c.isDeleted = false
    """,
    )
    override fun search(
        @Param("query") query: String,
        pageable: Pageable,
    ): Page<Category>

    fun existsByName(name: String): Boolean

    @Query("SELECT COUNT(b) FROM Book b WHERE b.category.id = :categoryId")
    fun countBooksByCategoryId(
        @Param("categoryId") categoryId: Long,
    ): Long

    fun findAllByIsDeletedFalse(): List<Category>
}
