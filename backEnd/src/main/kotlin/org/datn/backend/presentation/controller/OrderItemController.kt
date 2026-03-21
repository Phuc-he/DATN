package org.datn.backend.presentation.controller


import org.datn.backend.domain.entity.OrderItem
import org.datn.backend.domain.usecase.OrderItemService
import org.datn.backend.proto.BookProto
import org.datn.backend.proto.OrderItemProto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/order-items")
class OrderItemController(private val orderItemService: OrderItemService) {

    @GetMapping("/order/{orderId}", produces = ["application/x-protobuf"])
    fun getByOrder(@PathVariable orderId: Long): ResponseEntity<List<OrderItemProto>> {
        val items = orderItemService.getItemsByOrderId(orderId)
        val protoList = items.map { it.toProto() }
        return ResponseEntity.ok(protoList)
    }

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(@PathVariable id: Long): ResponseEntity<OrderItemProto> {
        val item = orderItemService.getById(id)
        return ResponseEntity.ok(item.toProto())
    }

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<OrderItemProto> {
        val updatedItem = orderItemService.update(id, updates)
        return ResponseEntity.ok(updatedItem.toProto())
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Unit> {
        orderItemService.delete(id)
        return ResponseEntity.noContent().build()
    }

    // --- Mapper Extension ---
    private fun OrderItem.toProto(): OrderItemProto {
        val bookProto = BookProto.newBuilder()
            .setId(this.book.id ?: 0L)
            .setTitle(this.book.title)
            .setImageUrl(this.book.imageUrl ?: "")
            .setPrice(this.book.price.toString())
            .build()

        return OrderItemProto.newBuilder()
            .setId(this.id ?: 0L)
            .setBook(bookProto)
            .setQuantity(this.quantity)
            .setUnitPrice(this.unitPrice.toString())
            .setDiscount(this.discount.toString())
            .build()
    }
}