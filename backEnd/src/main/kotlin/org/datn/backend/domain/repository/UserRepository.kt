package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : BaseRepository<User, Long> {
    override fun findByPage(pageable: Pageable): Page<User> = findAll(pageable)

    @Query(
        """
        SELECT u FROM User u 
        WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) 
        OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) 
        OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
    """,
    )
    override fun search(
        @Param("query") query: String,
        pageable: Pageable,
    ): Page<User>

    fun findByEmail(email: String): User?

    fun existsByUsername(username: String): Boolean

    fun existsByEmail(email: String): Boolean
}
