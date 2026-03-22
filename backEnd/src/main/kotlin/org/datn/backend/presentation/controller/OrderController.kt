package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.Order
import org.datn.backend.domain.entity.OrderItem
import org.datn.backend.domain.entity.OrderStatus
import org.datn.backend.domain.usecase.OrderService
import org.datn.backend.proto.*
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("/api/orders")
class OrderController(private val orderService: OrderService) {
    private val log = LoggerFactory.getLogger(javaClass)
    private val dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<OrderPageResponse> {
        val orders = orderService.getAll(pageable)
        return ResponseEntity.ok(toPageResponse(orders))
    }

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(@RequestParam query: String, pageable: Pageable): ResponseEntity<OrderPageResponse> {
        val orders = orderService.search(query, pageable)
        return ResponseEntity.ok(toPageResponse(orders))
    }

    @GetMapping(produces = ["application/x-protobuf"])
    fun getAll(): ResponseEntity<OrderProtoList> {
        val orders = orderService.getAll()
        log.info("Found ${orders.size} orders}");
        return ResponseEntity.ok(OrderProtoList.newBuilder().addAllData(orders.map { it.toProto() }).build())
    }

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(@PathVariable id: Long): ResponseEntity<OrderProto> {
        val order = orderService.getById(id)
        return ResponseEntity.ok(order.toProto())
    }

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
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder.toProto())
    }

    @PatchMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: Long,
        @RequestParam status: String
    ): ResponseEntity<OrderProto> {
        val updatedOrder = orderService.updateStatus(id, status)
        return ResponseEntity.ok(updatedOrder.toProto())
    }

    @PostMapping("/{id}/cancel")
    fun cancelOrder(@PathVariable id: Long): ResponseEntity<Unit> {
        orderService.cancelOrder(id)
        return ResponseEntity.noContent().build()
    }

    // --- Complex Nested Mapper ---
    private fun Order.toProto(): OrderProto {
        val builder = OrderProto.newBuilder()
            .setId(this.id ?: 0L)
            .setFullName(this.fullName)
            .setPhone(this.phone)
            .setAddress(this.address)
            .setCartId(this.cartId ?: "")
            .setTotalAmount(this.totalAmount.toString())
            .setStatus(org.datn.backend.proto.OrderStatus.valueOf(this.status.name))
            .setCreatedAt(this.createdAt?.format(dateFormatter) ?: "")

        // Map User
        builder.setUser(UserProto.newBuilder().setId(this.user.id ?: 0L).setUsername(this.user.username).build())

        // Map Items (Nested List)
        this.items.forEach { item ->
            val itemProto = OrderItemProto.newBuilder()
                .setId(item.id ?: 0L)
                .setQuantity(item.quantity)
                .setUnitPrice(item.unitPrice.toString())
                .setDiscount(item.discount.toString())
                .setBook(
                    BookProto.newBuilder().setId(item.book.id ?: 0L).setTitle(item.book.title)
                        .setImageUrl(item.book.imageUrl ?: "").setCategory(
                        CategoryProto.newBuilder().setName(item.book.category?.name ?: "")
                            .setImage(item.book.category?.image ?: "").build()
                    ).build()
                )
                .build()
            builder.addItems(itemProto)
        }

        return builder.build()
    }

    private fun toPageResponse(authors: Page<Order>): OrderPageResponse = OrderPageResponse.newBuilder()
        .addAllContent(authors.content.map { it.toProto() })
        .setTotalElements(authors.totalElements)
        .setTotalPages(authors.totalPages)
        .setPageNumber(authors.number)
        .setPageSize(authors.size)
        .build()
}