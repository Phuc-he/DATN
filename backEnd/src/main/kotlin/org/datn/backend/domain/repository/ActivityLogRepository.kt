package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.ActivityLog
import org.datn.backend.domain.entity.Author
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface ActivityLogRepository : BaseRepository<ActivityLog, Long> {
    override fun findByPage(pageable: Pageable): Page<ActivityLog> = findAll(pageable)

    @Query("""
        SELECT a FROM ActivityLog a 
        WHERE LOWER(a.action) LIKE LOWER(CONCAT('%', :query, '%')) 
           OR LOWER(a.entityName) LIKE LOWER(CONCAT('%', :query, '%')) 
           OR LOWER(a.performedBy) LIKE LOWER(CONCAT('%', :query, '%'))
    """)
    override fun search(@Param("query") query: String, pageable: Pageable): Page<ActivityLog>
}