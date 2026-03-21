package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.Order
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface OrderRepository : BaseRepository<Order, Long> {
    override fun findByPage(pageable: Pageable): Page<Order> = findAll(pageable)
    @Query("""
        SELECT o FROM Order o 
        WHERE CAST(o.id AS string) LIKE %:query% 
        OR LOWER(o.fullName) LIKE LOWER(CONCAT('%', :query, '%')) 
        OR o.phone LIKE %:query%
    """)
    override fun search(@Param("query") query: String, pageable: Pageable): Page<Order>
}