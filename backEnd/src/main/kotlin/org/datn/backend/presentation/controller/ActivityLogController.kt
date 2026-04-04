package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.ActivityLog
import org.datn.backend.domain.usecase.ActivityLogService
import org.datn.backend.presentation.mapper.toPageResponse
import org.datn.backend.presentation.mapper.toProto
import org.datn.backend.proto.ActivityLogPageResponse
import org.datn.backend.proto.ActivityLogProto
import org.datn.backend.proto.ActivityLogProtoList
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/activity-logs")
class ActivityLogController(
    private val activityLogService: ActivityLogService,
) {
    /**
     * GET /api/activity-logs
     * Returns a simple list of all activity logs in Protobuf format
     */
    @GetMapping(produces = ["application/x-protobuf"])
    fun getAllLogs(): ResponseEntity<ActivityLogProtoList> =
        ResponseEntity.ok(
            ActivityLogProtoList
                .newBuilder()
                .addAllData(activityLogService.getAll().map { it.toProto() })
                .build(),
        )

    /**
     * GET /api/activity-logs/all
     * Paginated retrieval of logs
     */
    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<ActivityLogPageResponse> =
        ResponseEntity.ok(activityLogService.getAll(pageable).toPageResponse())

    /**
     * GET /api/activity-logs/search
     * Search logs by action, entity name, or details
     */
    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(
        @RequestParam query: String,
        pageable: Pageable,
    ): ResponseEntity<ActivityLogPageResponse> = ResponseEntity.ok(activityLogService.search(query, pageable).toPageResponse())

    /**
     * POST /api/activity-logs
     * Manually create a log entry via Protobuf
     */
    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun createLog(
        @RequestBody logProto: ActivityLogProto,
    ): ResponseEntity<ActivityLogProto> =
        ResponseEntity.status(HttpStatus.CREATED).body(
            activityLogService
                .create(
                    ActivityLog(
                        action = logProto.action,
                        entityName = logProto.entityName,
                        details = logProto.details,
                        performedBy = logProto.performedBy ?: "Unknown",
                    ),
                ).toProto(),
        )

    /**
     * PATCH /api/activity-logs/{id}
     * Update an existing log entry (typically used for adding notes/results)
     */
    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun updateLog(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>,
    ): ResponseEntity<ActivityLogProto> = ResponseEntity.ok(activityLogService.update(id, updates).toProto())

    /**
     * DELETE /api/activity-logs/{id}
     * Remove a log entry
     */
    @DeleteMapping("/{id}")
    fun deleteLog(
        @PathVariable id: Long,
    ): ResponseEntity<Unit> {
        activityLogService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
