package org.datn.backend.domain.repository

import org.datn.backend.domain.entity.Voucher
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface VoucherRepository : BaseRepository<Voucher, Long> {
    // Implementation of the search method required by your BaseRepository
    @Query("SELECT v FROM Voucher v WHERE LOWER(v.code) LIKE LOWER(CONCAT('%', :query, '%'))")
    override fun search(
        @Param("query") query: String,
        pageable: Pageable,
    ): Page<Voucher>

    // Standard paginated find
    override fun findByPage(pageable: Pageable): Page<Voucher> = findAll(pageable)

    // Custom method to find a valid voucher by code
    fun findByCodeAndIsActiveTrue(code: String): Voucher?
}
