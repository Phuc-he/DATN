package org.datn.backend.presentation.controller


import org.datn.backend.domain.usecase.OrderItemService
import org.datn.backend.presentation.mapper.toProto
import org.datn.backend.proto.OrderItemProto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/order-items")
class OrderItemController(private val orderItemService: OrderItemService) {

    @GetMapping("/order/{orderId}", produces = ["application/x-protobuf"])
    fun getByOrder(@PathVariable orderId: Long): ResponseEntity<List<OrderItemProto>> =
        ResponseEntity.ok(orderItemService.getItemsByOrderId(orderId).map { it.toProto() })

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(@PathVariable id: Long): ResponseEntity<OrderItemProto> =
        ResponseEntity.ok(orderItemService.getById(id).toProto())


    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<OrderItemProto> = ResponseEntity.ok(orderItemService.update(id, updates)?.toProto())

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Unit> {
        orderItemService.delete(id)
        return ResponseEntity.noContent().build()
    }
}