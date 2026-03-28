package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.WebSetting
import org.datn.backend.domain.usecase.WebSettingService
import org.datn.backend.presentation.mapper.toPageResponse
import org.datn.backend.presentation.mapper.toProto
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
    fun getActive(): ResponseEntity<WebSettingProto> = ResponseEntity.ok(webSettingService.getActiveSetting().toProto())

    @GetMapping("all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<WebSettingPageResponse> =
        ResponseEntity.ok(webSettingService.getAll(pageable).toPageResponse())

    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun create(@RequestBody setting: WebSettingProto): ResponseEntity<WebSettingProto> =
        ResponseEntity.status(HttpStatus.CREATED).body(
            webSettingService.create(
                WebSetting(
                    webName = setting.webName,
                    logoUrl = setting.logoUrl,
                    headerIcon = setting.headerIcon,
                    contactEmail = setting.contactEmail,
                    footerText = setting.footerText,
                    isActive = setting.isActive,
                )
            )?.toProto()
        )

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<WebSettingProto> = ResponseEntity.ok(webSettingService.update(id, updates)?.toProto())
}