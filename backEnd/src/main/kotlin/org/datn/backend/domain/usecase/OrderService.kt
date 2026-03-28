package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.LogAction
import org.datn.backend.domain.entity.Order
import org.datn.backend.domain.entity.OrderStatus
import org.datn.backend.domain.repository.BookRepository
import org.datn.backend.domain.repository.OrderRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val bookRepository: BookRepository,
    private val activityLogService: ActivityLogService // Injected logging service
) {

    // READ operations: Kept clean without logging to avoid dashboard noise
    fun getAll(pageable: Pageable): Page<Order> = orderRepository.findByPage(pageable)

    fun search(query: String, pageable: Pageable): Page<Order> = orderRepository.search(query, pageable)

    fun getAll(): List<Order> = orderRepository.findAll()

    fun getById(id: Long): Order = orderRepository.findById(id)
        .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found") }

    /**
     * Use Case: Placing a new order.
     * Logs the creation and inventory deduction.
     */
    @Transactional
    fun create(orderRequest: Order): Order? =
        activityLogService.executeWithLog<Order>(LogAction.CREATE.name, "Order") {
            // 1. Validate Stock for each item
            orderRequest.items.forEach { item ->
                val book = bookRepository.findById(item.book.id!!)
                    .orElseThrow { ResponseStatusException(HttpStatus.BAD_REQUEST, "Book not found") }

                if (book.stock < item.quantity) {
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for: ${book.title}")
                }

                // 2. Deduct stock
                val updatedBook = book.copy(stock = book.stock - item.quantity)
                bookRepository.save(updatedBook)
            }

            // 3. Save the Order
            orderRepository.save(orderRequest)
        }

    /**
     * Use Case: Update Order Status
     */
    fun updateStatus(id: Long, newStatus: String): Order? =
        activityLogService.executeWithLog<Order>(LogAction.UPDATE.name, "Order") {
            val existingOrder = getById(id)

            val statusEnum = try {
                // Adjusting to handle both String names and Integer indices safely
                val index = newStatus.toIntOrNull()
                if (index != null) OrderStatus.entries[index]
                else OrderStatus.valueOf(newStatus.uppercase())
            } catch (e: Exception) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: $newStatus")
            }

            val updatedOrder = existingOrder.copy(status = statusEnum)
            orderRepository.save(updatedOrder)
        }

    /**
     * Use Case: Cancel Order
     * Logs the cancellation and the return of stock to inventory.
     */
    @Transactional
    fun cancelOrder(id: Long) =
        activityLogService.executeWithLog<Unit>(LogAction.DELETE.name, "Order") {
            val order = getById(id)

            if (order.status == OrderStatus.DELIVERED || order.status == OrderStatus.CANCELLED) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot cancel a delivered or already cancelled order")
            }

            // Return stock to inventory
            order.items.forEach { item ->
                val book = item.book
                val updatedBook = book.copy(stock = book.stock + item.quantity)
                bookRepository.save(updatedBook)
            }

            val cancelledOrder = order.copy(status = OrderStatus.CANCELLED)
            orderRepository.save(cancelledOrder)
        }
}