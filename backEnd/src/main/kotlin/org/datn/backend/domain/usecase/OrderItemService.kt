package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.LogAction
import org.datn.backend.domain.entity.OrderItem
import org.datn.backend.domain.repository.OrderItemRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal

@Service
class OrderItemService(
    private val orderItemRepository: OrderItemRepository,
    private val activityLogService: ActivityLogService, // Injected logging service
) {
    // READ operations: Generally not logged to avoid cluttering the activity feed
    fun getItemsByOrderId(orderId: Long): List<OrderItem> = orderItemRepository.findByOrderId(orderId)

    fun getById(id: Long): OrderItem =
        orderItemRepository
            .findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Order item not found") }

    /**
     * Use Case: Add item to an existing order (e.g., manual admin adjustment)
     */
    fun create(orderItem: OrderItem): OrderItem? =
        activityLogService.executeWithLog<OrderItem>(LogAction.CREATE.name, "OrderItem") {
            orderItemRepository.save(orderItem)
        }

    /**
     * Use Case: Update quantity or apply a manual discount to a line item
     */
    fun update(
        id: Long,
        updates: Map<String, Any>,
    ): OrderItem? =
        activityLogService.executeWithLog<OrderItem>(LogAction.UPDATE.name, "OrderItem") {
            val existingItem = getById(id)

            val updatedItem =
                existingItem.copy(
                    quantity = updates["quantity"] as? Int ?: existingItem.quantity,
                    discount =
                        (updates["discount"] as? Number)?.toDouble()?.let { BigDecimal.valueOf(it) }
                            ?: existingItem.discount,
                    unitPrice =
                        (updates["unitPrice"] as? Number)?.toDouble()?.let { BigDecimal.valueOf(it) }
                            ?: existingItem.unitPrice,
                )

            orderItemRepository.save(updatedItem)
        }

    /**
     * Use Case: Remove an item from an order
     */
    fun delete(id: Long) =
        activityLogService.executeWithLog<Unit>(LogAction.DELETE.name, "OrderItem") {
            if (!orderItemRepository.existsById(id)) {
                throw ResponseStatusException(HttpStatus.NOT_FOUND, "Order item not found")
            }
            orderItemRepository.deleteById(id)
        }
}
