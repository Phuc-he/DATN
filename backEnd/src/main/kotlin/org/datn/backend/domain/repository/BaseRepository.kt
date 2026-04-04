package org.datn.backend.domain.repository

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.NoRepositoryBean

@NoRepositoryBean
interface BaseRepository<T : Any, ID : Any> : JpaRepository<T, ID> {
    fun findByPage(pageable: Pageable): Page<T>

    fun search(
        query: String,
        pageable: Pageable,
    ): Page<T>
}
