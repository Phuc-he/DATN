package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.Author
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface AuthorRepository : BaseRepository<Author, Long> {
    override fun findByPage(pageable: Pageable): Page<Author> = findAll(pageable)

    @Query(
        """
        SELECT a FROM Author a 
        WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')) 
        OR LOWER(a.bio) LIKE LOWER(CONCAT('%', :query, '%'))
    """,
    )
    override fun search(
        @Param("query") query: String,
        pageable: Pageable,
    ): Page<Author>

    fun existsByName(name: String): Boolean
}
