package org.datn.backend.presentation.controller

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import org.datn.backend.domain.entity.User
import org.datn.backend.domain.usecase.UserService
import org.datn.backend.proto.Role
import org.datn.backend.proto.UserPageResponse
import org.datn.backend.proto.UserProto
import org.datn.backend.proto.UserProtoList
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {
    private val log = org.slf4j.LoggerFactory.getLogger(javaClass)

    private val dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<UserPageResponse> {
        val users = userService.getAll(pageable)
//        val gson = GsonBuilder().setPrettyPrinting().create();
//        log.info("Found ${users.size} users with pageable $pageable ${gson.toJson(users)}")
        return ResponseEntity.ok(toPageResponse(users))
    }

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(@RequestParam query: String, pageable: Pageable): ResponseEntity<UserPageResponse> {
        val users = userService.search(query, pageable)
        return ResponseEntity.ok(toPageResponse(users))
    }

    @GetMapping(produces = ["application/x-protobuf"])
    fun getAll(): ResponseEntity<UserProtoList> {
        val users = userService.getAll()
        return ResponseEntity.ok(UserProtoList.newBuilder().addAllData(users.map { it.toProto() }).build())
    }

    @GetMapping("/email/{email}", produces = ["application/x-protobuf"])
    fun getByEmail(@PathVariable email: String): ResponseEntity<UserProto> {
        val user = userService.findByEmail(email)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(user.toProto())
    }

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(@PathVariable id: Long): ResponseEntity<UserProto> {
        val user = userService.getById(id)
        return ResponseEntity.ok(user.toProto())
    }

    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun register(@RequestBody proto: UserProto): ResponseEntity<UserProto> {
        val role = when (proto.role) {
            Role.ADMIN -> org.datn.backend.domain.entity.Role.ADMIN
            Role.CUSTOMER -> org.datn.backend.domain.entity.Role.CUSTOMER
            Role.AUTHOR_ROLE -> org.datn.backend.domain.entity.Role.AUTHOR
            else -> org.datn.backend.domain.entity.Role.CUSTOMER
        }
        val entity = User(
            username = proto.username,
            email = proto.email,
            password = "", // Ensure your Service handles hashing!
            fullName = proto.fullName,
            address = proto.address,
            phone = proto.phone,
            role = role
        )

        val savedUser = userService.create(entity)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser.toProto())
    }

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun updateProfile(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<UserProto> {
        val updatedUser = userService.update(id, updates)
        return ResponseEntity.ok(updatedUser.toProto())
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: Long): ResponseEntity<Unit> {
        userService.delete(id)
        return ResponseEntity.noContent().build()
    }

    // --- Mapper Extension ---
    private fun User.toProto(): UserProto {
        // Map the Domain Role to the Proto Role
        val protoRole = when (this.role) {
            org.datn.backend.domain.entity.Role.ADMIN -> Role.ADMIN
            org.datn.backend.domain.entity.Role.CUSTOMER -> Role.CUSTOMER
            org.datn.backend.domain.entity.Role.AUTHOR -> Role.AUTHOR_ROLE
        }

        return UserProto.newBuilder()
            .setId(this.id ?: 0L)
            .setUsername(this.username)
            .setEmail(this.email)
            .setFullName(this.fullName ?: "")
            .setAddress(this.address ?: "")
            .setPhone(this.phone ?: "")
            .setRole(protoRole) // Pass the mapped enum directly
            .setAvatar(this.avatar ?: "")
            .setCreatedAt(this.createdAt?.format(dateFormatter) ?: "")
            .build()
    }

    private fun toPageResponse(users: Page<User>): UserPageResponse = UserPageResponse.newBuilder()
        .addAllContent(users.content.map { it.toProto() })
        .setTotalElements(users.totalElements)
        .setTotalPages(users.totalPages)
        .setPageNumber(users.number)
        .setPageSize(users.size)
        .build()
}