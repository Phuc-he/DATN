package org.datn.backend.domain.usecase

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
    private val bookRepository: BookRepository
) {

    fun getAll(pageable: Pageable): Page<Order> = orderRepository.findByPage(pageable)

    fun search(query: String, pageable: Pageable): Page<Order> = orderRepository.search(query, pageable)

    fun getAll(): List<Order> = orderRepository.findAll()

    fun getById(id: Long): Order = orderRepository.findById(id)
        .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found") }

    /**
     * Use Case: Placing a new order.
     * We use @Transactional to ensure that if saving an item fails,
     * the whole order is rolled back.
     */
    @Transactional
    fun create(orderRequest: Order): Order {
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

        // 3. Save the Order (JPA Cascade will handle saving OrderItems)
        return orderRepository.save(orderRequest)
    }

    /**
     * Use Case: Update Order Status (e.g., from UNPROCESSED to SHIPPED)
     */
    fun updateStatus(id: Long, newStatus: String): Order {
        val existingOrder = getById(id)

        val statusEnum = try {
            OrderStatus.valueOf(newStatus.uppercase())
        } catch (e: IllegalArgumentException) {
            e.printStackTrace()
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: $newStatus")
        }

        val updatedOrder = existingOrder.copy(status = statusEnum)
        return orderRepository.save(updatedOrder)
    }

    /**
     * Use Case: Cancel Order
     * When cancelling, we should technically return the stock to the books.
     */
    @Transactional
    fun cancelOrder(id: Long) {
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