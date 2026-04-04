package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.LogAction
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
class WebSettingService(
    private val webSettingRepository: WebSettingRepository,
    private val activityLogService: ActivityLogService, // Injected logging service
) {
    // READ operations: No logging to avoid cluttering the activity feed
    fun getAll(pageable: Pageable): Page<WebSetting> = webSettingRepository.findByPage(pageable)

    fun search(
        query: String,
        pageable: Pageable,
    ): Page<WebSetting> = webSettingRepository.search(query, pageable)

    fun findById(id: Long): WebSetting =
        webSettingRepository
            .findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Setting not found") }

    fun getActiveSetting(): WebSetting =
        webSettingRepository.findFirstByIsActiveTrue()
            ?: WebSetting(
                id = 0L,
                webName = "Book shop",
                logoUrl = "",
                headerIcon = "",
                contactEmail = "",
                footerText = "",
                isActive = true,
                updatedAt = LocalDateTime.now(),
            )

    /**
     * Creates a new configuration. If set to active, logs the change.
     */
    @Transactional
    fun create(setting: WebSetting): WebSetting? =
        activityLogService.executeWithLog<WebSetting>(LogAction.CREATE.name, "WebSetting") {
            if (setting.isActive) {
                deactivateAllOthers()
            }
            webSettingRepository.save(setting)
        }

    /**
     * Updates branding or active status.
     * Transactional to ensure 'deactivateAllOthers' and 'save' happen together.
     */
    @Transactional
    fun update(
        id: Long,
        updates: Map<String, Any>,
    ): WebSetting? =
        activityLogService.executeWithLog<WebSetting>(LogAction.UPDATE.name, "WebSetting") {
            val existing = findById(id)

            val willBeActive = updates["isActive"] as? Boolean ?: existing.isActive
            if (willBeActive && !existing.isActive) {
                deactivateAllOthers()
            }

            val updated =
                existing.copy(
                    webName = updates["webName"] as? String ?: existing.webName,
                    logoUrl = updates["logoUrl"] as? String ?: existing.logoUrl,
                    headerIcon = updates["headerIcon"] as? String ?: existing.headerIcon,
                    contactEmail = updates["contactEmail"] as? String ?: existing.contactEmail,
                    footerText = updates["footerText"] as? String ?: existing.footerText,
                    isActive = willBeActive,
                    updatedAt = LocalDateTime.now(),
                )

            webSettingRepository.save(updated)
        }

    /**
     * Deletes a config. Active configs cannot be deleted to prevent a broken UI.
     */
    @Transactional
    fun delete(id: Long) =
        activityLogService.executeWithLog<Unit>(LogAction.DELETE.name, "WebSetting") {
            val setting = findById(id)
            if (setting.isActive) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete the active configuration")
            }
            webSettingRepository.delete(setting)
        }

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
