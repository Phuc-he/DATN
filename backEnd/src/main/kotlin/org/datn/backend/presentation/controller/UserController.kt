package org.datn.backend.presentation.controller

import org.datn.backend.domain.usecase.UserService
import org.datn.backend.presentation.mapper.toEntity
import org.datn.backend.presentation.mapper.toPageResponse
import org.datn.backend.presentation.mapper.toProto
import org.datn.backend.proto.UserPageResponse
import org.datn.backend.proto.UserProto
import org.datn.backend.proto.UserProtoList
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService,
) {
    private val log = org.slf4j.LoggerFactory.getLogger(javaClass)

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<UserPageResponse> = ResponseEntity.ok(userService.getAll(pageable).toPageResponse())

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(
        @RequestParam query: String,
        pageable: Pageable,
    ): ResponseEntity<UserPageResponse> = ResponseEntity.ok(userService.search(query, pageable).toPageResponse())

    @GetMapping(produces = ["application/x-protobuf"])
    fun getAll(): ResponseEntity<UserProtoList> {
        val users = userService.getAll()
        return ResponseEntity.ok(UserProtoList.newBuilder().addAllData(users.map { it.toProto() }).build())
    }

    @GetMapping("/email/{email}", produces = ["application/x-protobuf"])
    fun getByEmail(
        @PathVariable email: String,
    ): ResponseEntity<UserProto> {
        val user =
            userService.findByEmail(email)
                ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(user.toProto())
    }

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(
        @PathVariable id: Long,
    ): ResponseEntity<UserProto> {
        val user = userService.getById(id)
        return ResponseEntity.ok(user.toProto())
    }

    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun register(
        @RequestBody proto: UserProto,
    ): ResponseEntity<UserProto> {
        val savedUser = userService.create(proto.toEntity())
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser?.toProto())
    }

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun updateProfile(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>,
    ): ResponseEntity<UserProto> = ResponseEntity.ok(userService.update(id, updates)?.toProto())

    @DeleteMapping("/{id}")
    fun deleteUser(
        @PathVariable id: Long,
    ): ResponseEntity<Unit> {
        userService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
