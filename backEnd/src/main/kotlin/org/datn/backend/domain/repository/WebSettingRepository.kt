package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.WebSetting
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface WebSettingRepository : BaseRepository<WebSetting, Long> {
    @Query("SELECT w FROM WebSetting w WHERE LOWER(w.webName) LIKE LOWER(CONCAT('%', :query, '%'))")
    override fun search(
        @Param("query") query: String,
        pageable: Pageable,
    ): Page<WebSetting>

    override fun findByPage(pageable: Pageable): Page<WebSetting> = findAll(pageable)

    // Helper to find the current active configuration
    fun findFirstByIsActiveTrue(): WebSetting?
}
