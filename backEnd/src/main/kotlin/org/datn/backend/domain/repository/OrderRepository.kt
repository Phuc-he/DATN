package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.Order
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
interface OrderRepository : BaseRepository<Order, Long> {
    override fun findByPage(pageable: Pageable): Page<Order> = findAll(pageable)

    @Query(
        """
        SELECT o FROM Order o
        WHERE CAST(o.id AS string) LIKE %:query%
        OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
        OR o.phone LIKE %:query%
    """,
    )
    override fun search(
        @Param("query") query: String,
        pageable: Pageable,
    ): Page<Order>

    fun findByUserId(userId: Long): List<Order>

    @Query(
        """
        SELECT o FROM Order o
        WHERE o.user.id = :userId
        AND o.isCart = true
    """,
    )
    fun findCartByUser(userId: Long): Order?

    @Modifying
    @Transactional
    @Query("DELETE FROM Order o WHERE o.user.id = :userId AND o.isCart = true")
    fun clearCartByUserId(userId: Long): Int

    @Modifying
    @Transactional
    @Query("UPDATE Order o SET o.user.id = :userId WHERE o.id = :id")
    fun updateUserForOrder(id: Long, userId: Long): Int
}
