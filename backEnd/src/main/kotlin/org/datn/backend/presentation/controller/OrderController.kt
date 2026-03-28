package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.Order
import org.datn.backend.domain.entity.OrderItem
import org.datn.backend.domain.entity.OrderStatus
import org.datn.backend.domain.usecase.OrderService
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
import java.math.BigDecimal

@RestController
@RequestMapping("/api/orders")
class OrderController(private val orderService: OrderService) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<OrderPageResponse> =
        ResponseEntity.ok(orderService.getAll(pageable).toPageResponse())

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(@RequestParam query: String, pageable: Pageable): ResponseEntity<OrderPageResponse> =
        ResponseEntity.ok(orderService.search(query, pageable).toPageResponse())

    @GetMapping(produces = ["application/x-protobuf"])
    fun getAll(): ResponseEntity<OrderProtoList> {
        val orders = orderService.getAll()
        log.info("Found ${orders.size} orders}");
        return ResponseEntity.ok(OrderProtoList.newBuilder().addAllData(orders.map { it.toProto() }).build())
    }

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(@PathVariable id: Long): ResponseEntity<OrderProto> =
        ResponseEntity.ok(orderService.getById(id).toProto())

    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun placeOrder(@RequestBody proto: OrderProto): ResponseEntity<OrderProto> {

        // 1. Create the parent Order entity first
        val entity = Order(
            fullName = proto.fullName,
            phone = proto.phone,
            address = proto.address,
            cartId = proto.cartId,
            totalAmount = BigDecimal(proto.totalAmount),
            status = OrderStatus.valueOf(proto.status.name),
            user = org.datn.backend.domain.entity.User(id = proto.user.id, username = "", email = "", password = "")
        )

        // 2. Map the items and link them to the parent entity
        val items = proto.itemsList.map { itemProto ->
            OrderItem(
                // Link back to the 'entity' we just defined above
                order = entity,
                book = org.datn.backend.domain.entity.Book(
                    id = itemProto.book.id,
                    title = "",
                    price = BigDecimal.ZERO,
                ),
                quantity = itemProto.quantity,
                unitPrice = BigDecimal(itemProto.unitPrice),
                discount = BigDecimal(itemProto.discount)
            )
        }.toMutableList()

        // 3. Attach the items list to the order
        entity.items.addAll(items)

        val createdOrder = orderService.create(entity)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder?.toProto())
    }

    @PatchMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: Long,
        @RequestParam status: String
    ): ResponseEntity<OrderProto> = ResponseEntity.ok(orderService.updateStatus(id, status)?.toProto())

    @PostMapping("/{id}/cancel")
    fun cancelOrder(@PathVariable id: Long): ResponseEntity<Unit> {
        orderService.cancelOrder(id)
        return ResponseEntity.noContent().build()
    }
}