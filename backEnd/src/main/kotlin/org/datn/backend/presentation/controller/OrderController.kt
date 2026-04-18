package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.User
import org.datn.backend.domain.usecase.OrderService
import org.datn.backend.domain.usecase.UserService
import org.datn.backend.presentation.mapper.toEntity
import org.datn.backend.presentation.mapper.toPageResponse
import org.datn.backend.presentation.mapper.toProto
import org.datn.backend.proto.OrderPageResponse
import org.datn.backend.proto.OrderProto
import org.datn.backend.proto.OrderProtoList
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val orderService: OrderService,
    private val userService: UserService,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<OrderPageResponse> =
        ResponseEntity.ok(orderService.getAll(pageable).toPageResponse())

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(
        @RequestParam query: String,
        pageable: Pageable,
    ): ResponseEntity<OrderPageResponse> = ResponseEntity.ok(orderService.search(query, pageable).toPageResponse())

    @GetMapping(produces = ["application/x-protobuf"])
    fun getAll(): ResponseEntity<OrderProtoList> {
        val orders = orderService.getAll()
        log.info("Found ${orders.size} orders}")
        return ResponseEntity.ok(OrderProtoList.newBuilder().addAllData(orders.map { it.toProto() }).build())
    }

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(
        @PathVariable id: Long,
    ): ResponseEntity<OrderProto> = ResponseEntity.ok(orderService.getById(id).toProto())

    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun placeOrder(
        @RequestBody proto: OrderProto,
    ): ResponseEntity<OrderProto> {
        val user = try {
            userService.getById(proto.user.id)
        } catch (e: Exception) {
            log.error("User not found with id: ${proto.user.id}")
            userService.create(
                User(
                    id = null,
                    username = "${System.currentTimeMillis()}",
                    email = "${System.currentTimeMillis()}@example.com",
                    password = ""
                )
            ) ?: User(id = proto.user.id, username = "", email = "", password = "")
        }

        val entity = proto.toEntity(user)
        val createdOrder = orderService.create(entity)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder?.toProto())
    }

    @PatchMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: Long,
        @RequestParam status: String,
    ): ResponseEntity<OrderProto> = ResponseEntity.ok(orderService.updateStatus(id, status)?.toProto())

    @PostMapping("/{id}/cancel")
    fun cancelOrder(
        @PathVariable id: Long,
    ): ResponseEntity<Unit> {
        orderService.cancelOrder(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/{id}/cart", produces = ["application/x-protobuf"])
    fun getByCartByUserId(
        @PathVariable id: Long,
    ): ResponseEntity<OrderProto> = ResponseEntity.ok(orderService.findCartByUser(id)?.toProto())

    @PatchMapping("/{id}/user")
    fun updateUserForOrder(
        @PathVariable id: Long,
        @RequestParam userId: Long,
    ): ResponseEntity<Int> = ResponseEntity.ok(orderService.updateOrderByUser(id, userId))

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<OrderProto> = ResponseEntity.ok(orderService.updateOrderCart(id, updates)?.toProto())
}
