package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.Role
import org.datn.backend.domain.entity.User
import org.datn.backend.domain.repository.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class UserService(private val userRepository: UserRepository) {

    fun getAll(pageable: Pageable): Page<User> = userRepository.findByPage(pageable)

    fun search(query: String, pageable: Pageable): Page<User> = userRepository.search(query, pageable)

    fun getAll(): List<User> = userRepository.findAll()

    fun findByEmail(email: String): User? = userRepository.findByEmail(email)

    fun getById(id: Long): User = userRepository.findById(id)
        .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "User not found") }

    /**
     * Use Case: Register a new user
     */
    fun create(user: User): User {
        // 1. Check if username or email is already taken
        if (userRepository.existsByUsername(user.username)) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Username is already taken")
        }
        if (userRepository.existsByEmail(user.email)) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered")
        }

        // TODO: passwordEncoder.encode(user.password)
        // Always hash passwords before saving to MySQL!

        return userRepository.save(user)
    }

    /**
     * Use Case: Update user profile details
     */
    fun update(id: Long, updates: Map<String, Any>): User {
        val existingUser = getById(id)

        val updatedUser = existingUser.copy(
            fullName = updates["fullName"] as? String ?: existingUser.fullName,
            address = updates["address"] as? String ?: existingUser.address,
            phone = updates["phone"] as? String ?: existingUser.phone,
            // Only allow role updates if specifically needed (usually an Admin task)
            role = (updates["role"] as? String)?.let { Role.valueOf(it.uppercase()) } ?: existingUser.role,
            avatar = updates["avatar"] as? String ?: existingUser.avatar
        )

        return userRepository.save(updatedUser)
    }

    /**
     * Use Case: Delete user
     */
    fun delete(id: Long) {
        if (!userRepository.existsById(id)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
        }
        userRepository.deleteById(id)
    }
}