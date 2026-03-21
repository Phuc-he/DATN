package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.OrderItem
import org.datn.backend.domain.repository.OrderItemRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal

@Service
class OrderItemService(private val orderItemRepository: OrderItemRepository) {

    // Use Case: Fetch all items for a specific order
    fun getItemsByOrderId(orderId: Long): List<OrderItem> {
        return orderItemRepository.findByOrderId(orderId)
    }

    // Use Case: Find a specific item detail
    fun getById(id: Long): OrderItem {
        return orderItemRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Order item not found") }
    }

    // Use Case: Add item to an existing order (e.g., manual admin adjustment)
    fun create(orderItem: OrderItem): OrderItem {
        return orderItemRepository.save(orderItem)
    }

    // Use Case: Update quantity or apply a manual discount to a line item
    fun update(id: Long, updates: Map<String, Any>): OrderItem {
        val existingItem = getById(id)

        val updatedItem = existingItem.copy(
            quantity = updates["quantity"] as? Int ?: existingItem.quantity,
            discount = (updates["discount"] as? Number)?.toDouble()?.let { BigDecimal.valueOf(it) }
                ?: existingItem.discount,
            unitPrice = (updates["unitPrice"] as? Number)?.toDouble()?.let { BigDecimal.valueOf(it) }
                ?: existingItem.unitPrice
        )

        return orderItemRepository.save(updatedItem)
    }

    // Use Case: Remove an item from an order
    fun delete(id: Long) {
        if (!orderItemRepository.existsById(id)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Order item not found")
        }
        orderItemRepository.deleteById(id)
    }
}