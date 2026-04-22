package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.User
import org.datn.backend.domain.entity.UserHistoryStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
interface UserRepository : BaseRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.isDeleted = false")
    override fun findByPage(pageable: Pageable): Page<User>

    @Query(
        """
        SELECT u FROM User u
        WHERE (LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')))
        AND u.isDeleted = false
    """,
    )
    override fun search(
        @Param("query") query: String,
        pageable: Pageable,
    ): Page<User>

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isDeleted = false")
    fun findByEmail(@Param("email") email: String): User?

    fun existsByUsername(username: String): Boolean

    fun existsByEmail(email: String): Boolean

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.historyStatus = :status WHERE u.id = :userId")
    fun updateHistoryStatus(
        @Param("userId") userId: Long,
        @Param("status") status: UserHistoryStatus
    ): Int

    fun findAllByIsDeletedFalse(): List<User>
}
