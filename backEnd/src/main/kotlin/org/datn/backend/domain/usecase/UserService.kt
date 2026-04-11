package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.LogAction
import org.datn.backend.domain.entity.Order
import org.datn.backend.domain.entity.OrderStatus
import org.datn.backend.domain.entity.Role
import org.datn.backend.domain.entity.User
import org.datn.backend.domain.entity.UserHistoryStatus
import org.datn.backend.domain.repository.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class UserService(
    private val userRepository: UserRepository,
    private val activityLogService: ActivityLogService, // Injected logging service
    private val orderService: OrderService
) {
    // READ operations: Kept standard to maintain high performance and clean logs
    fun getAll(pageable: Pageable): Page<User> = userRepository.findByPage(pageable)

    fun search(
        query: String,
        pageable: Pageable,
    ): Page<User> = userRepository.search(query, pageable)

    fun getAll(): List<User> = userRepository.findAll()

    fun findByEmail(email: String): User? = userRepository.findByEmail(email)

    fun getById(id: Long): User =
        userRepository
            .findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "User not found") }

    /**
     * Use Case: Register a new user.
     * Logs the registration event.
     */
    fun create(user: User): User? =
        activityLogService.executeWithLog(LogAction.CREATE.name, "User") {
            if (userRepository.existsByUsername(user.username)) {
                throw ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken")
            }
            if (userRepository.existsByEmail(user.email)) {
                throw ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered")
            }

            // Note: Password hashing should occur here before saving
            userRepository.save(user)
        }

    /**
     * Use Case: Update user profile details.
     * Logs profile changes or role escalations.
     */
    fun update(
        id: Long,
        updates: Map<String, Any>,
    ): User? =
        activityLogService.executeWithLog(LogAction.UPDATE.name, "User") {
            val existingUser = getById(id)

            val updatedUser =
                existingUser.copy(
                    fullName = updates["fullName"] as? String ?: existingUser.fullName,
                    address = updates["address"] as? String ?: existingUser.address,
                    phone = updates["phone"] as? String ?: existingUser.phone,
                    role = (updates["role"] as? Int)?.let { Role.entries[it] } ?: existingUser.role,
                    avatar = updates["avatar"] as? String ?: existingUser.avatar,
                    historyStatus = (updates["historyStatus"] as? Int)?.let { UserHistoryStatus.entries[it] } ?: existingUser.historyStatus,
                )

            userRepository.save(updatedUser)
        }

    /**
     * Use Case: Delete user.
     * Logs the account removal.
     */
    fun delete(id: Long) =
        activityLogService.executeWithLog(LogAction.DELETE.name, "User") {
            if (!userRepository.existsById(id)) {
                throw ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
            }
            userRepository.deleteById(id)
        }

    fun updateStatusForAllUser() {
        userRepository.findAll().forEach {
            it.id?.let { id ->
                val status = calcNewStatus(it, orderService.findByUserId(id))
                update(id, mapOf("historyStatus" to status.ordinal))
            }
        }
    }

    /**
     * Recalculates and updates the history status for a specific user
     */
    fun updateStatusForUser(id: Long): User {
        val user = userRepository.findById(id).orElseThrow {
            RuntimeException("User not found with id: $id")
        }

        val orders = orderService.findByUserId(id)
        val newStatus = calcNewStatus(user, orders)

        // Perform the partial update
        return update(id, mapOf("historyStatus" to newStatus.ordinal))
            ?: throw RuntimeException("Failed to update user status")
    }

    private fun calcNewStatus(user: User, orders: List<Order>): UserHistoryStatus {
        // 1. Identify "Boomers" (Khách từng boom hàng)
        // Priority 1: If any order in their history is CANCELLED, they are flagged.
        val hasBoomed = orders.any { it.status == OrderStatus.CANCELLED }
        if (hasBoomed) {
            return UserHistoryStatus.BOOM_HISTORY
        }

        // 2. Identify "Good History" (Khách có lịch sử tốt)
        // Priority 2: If they have a solid track record (e.g., 3+ delivered orders)
        val deliveredCount = orders.count { it.status == OrderStatus.DELIVERED }
        if (deliveredCount >= 3) {
            return UserHistoryStatus.GOOD_HISTORY
        }

        // 3. Default: "New User" (Khách mới / chưa có lịch sử)
        // Applies if they have 0 cancelled orders and < 3 delivered orders.
        return UserHistoryStatus.NEW_USER
    }
}
