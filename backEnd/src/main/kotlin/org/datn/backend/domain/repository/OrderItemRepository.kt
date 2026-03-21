package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.OrderItem
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface OrderItemRepository : BaseRepository<OrderItem, Long> {
    fun findByOrderId(orderId: Long): List<OrderItem>

    @Query("SELECT o FROM OrderItem o WHERE CAST(o.id AS string) LIKE %:query%")
    override fun search(@Param("query") query: String, pageable: Pageable): Page<OrderItem>
    override fun findByPage(pageable: Pageable): Page<OrderItem> = findAll(pageable)
}