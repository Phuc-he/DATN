package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.WebSetting
import org.datn.backend.domain.repository.WebSettingRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@Service
class WebSettingService(private val webSettingRepository: WebSettingRepository) {

    fun getAll(pageable: Pageable): Page<WebSetting> = webSettingRepository.findByPage(pageable)

    fun search(query: String, pageable: Pageable): Page<WebSetting> =
        webSettingRepository.search(query, pageable)

    fun findById(id: Long): WebSetting = webSettingRepository.findById(id)
        .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Setting not found") }

    /**
     * Gets the currently active website configuration.
     * This is what your Next.js 'Header' and 'Footer' will call.
     */
    fun getActiveSetting(): WebSetting = webSettingRepository.findFirstByIsActiveTrue()
        ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "No active web settings found")

    @Transactional
    fun create(setting: WebSetting): WebSetting {
        // If the new setting is active, deactivate others first
        if (setting.isActive) {
            deactivateAllOthers()
        }
        return webSettingRepository.save(setting)
    }

    @Transactional
    fun update(id: Long, updates: Map<String, Any>): WebSetting {
        val existing = findById(id)

        // Handle activation logic
        val willBeActive = updates["isActive"] as? Boolean ?: existing.isActive
        if (willBeActive && !existing.isActive) {
            deactivateAllOthers()
        }

        val updated = existing.copy(
            webName = updates["webName"] as? String ?: existing.webName,
            logoUrl = updates["logoUrl"] as? String ?: existing.logoUrl,
            headerIcon = updates["headerIcon"] as? String ?: existing.headerIcon,
            contactEmail = updates["contactEmail"] as? String ?: existing.contactEmail,
            footerText = updates["footerText"] as? String ?: existing.footerText,
            isActive = willBeActive,
            updatedAt = LocalDateTime.now()
        )

        return webSettingRepository.save(updated)
    }

    @Transactional
    fun delete(id: Long) {
        val setting = findById(id)
        if (setting.isActive) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete the active configuration")
        }
        webSettingRepository.delete(setting)
    }

    /**
     * Helper to ensure only one setting is active at a time
     */
    private fun deactivateAllOthers() {
        val allSettings = webSettingRepository.findAll()
        allSettings.forEach {
            if (it.isActive) {
                it.isActive = false
                webSettingRepository.save(it)
            }
        }
    }
}