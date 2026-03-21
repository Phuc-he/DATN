package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.WebSetting
import org.datn.backend.domain.usecase.WebSettingService
import org.datn.backend.proto.WebSettingPageResponse
import org.datn.backend.proto.WebSettingProto
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/settings")
class WebSettingController(private val webSettingService: WebSettingService) {

    /**
     * The most important endpoint: Gets the active logo, name, etc.
     * Used by Next.js Layout/Header components.
     */
    @GetMapping("/active", produces = ["application/x-protobuf"])
    fun getActive(): ResponseEntity<WebSettingProto> {
        val active = webSettingService.getActiveSetting()
        return ResponseEntity.ok(toProto(active))
    }

    @GetMapping(produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<WebSettingPageResponse> {
        val page = webSettingService.getAll(pageable)
        return ResponseEntity.ok(toPageResponse(page))
    }

    @PostMapping(consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun create(@RequestBody setting: WebSetting): ResponseEntity<WebSettingProto> {
        val saved = webSettingService.create(setting)
        return ResponseEntity.status(HttpStatus.CREATED).body(toProto(saved))
    }

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<WebSettingProto> {
        val updated = webSettingService.update(id, updates)
        return ResponseEntity.ok(toProto(updated))
    }

    // --- Mapper Helpers ---

    private fun toProto(entity: WebSetting): WebSettingProto {
        return WebSettingProto.newBuilder()
            .setId(entity.id ?: 0L)
            .setWebName(entity.webName)
            .setLogoUrl(entity.logoUrl ?: "")
            .setHeaderIcon(entity.headerIcon ?: "BookOpen")
            .setContactEmail(entity.contactEmail ?: "")
            .setFooterText(entity.footerText ?: "")
            .setIsActive(entity.isActive)
            .setUpdatedAt(entity.updatedAt?.toString() ?: "")
            .build()
    }

    private fun toPageResponse(page: org.springframework.data.domain.Page<WebSetting>): WebSettingPageResponse {
        return WebSettingPageResponse.newBuilder()
            .addAllSettings(page.content.map { toProto(it) })
            .setTotalPages(page.totalPages)
            .setTotalElements(page.totalElements)
            .build()
    }
}