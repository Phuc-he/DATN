package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.Category
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface CategoryRepository : BaseRepository<Category, Long> {
    override fun findByPage(pageable: Pageable): Page<Category> = findAll(pageable)
    @Query("""
        SELECT c FROM Category c 
        WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) 
        OR LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))
    """)
    override fun search(@Param("query") query: String, pageable: Pageable): Page<Category>
    fun existsByName(name: String): Boolean
}