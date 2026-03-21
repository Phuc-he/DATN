package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.Category
import org.datn.backend.domain.repository.BookRepository
import org.datn.backend.domain.repository.CategoryRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val bookRepository: BookRepository
) {

    fun create(category: Category): Category {
        // Prevent duplicate category names
        if (categoryRepository.existsByName(category.name)) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Category already exists")
        }
        return categoryRepository.save(category)
    }

    fun getAll(): List<Category> = categoryRepository.findAll()

    fun getAll(pageable: Pageable): Page<Category> = categoryRepository.findByPage(pageable)

    fun search(query: String, pageable: Pageable): Page<Category> = categoryRepository.search(query, pageable)

    fun getById(id: Long): Category {
        return categoryRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found") }
    }

    fun update(id: Long, updates: Map<String, Any>): Category {
        val existingCategory = getById(id)

        val updatedCategory = existingCategory.copy(
            name = updates["name"] as? String ?: existingCategory.name,
            description = updates["description"] as? String ?: existingCategory.description,
            image = updates["image"] as? String ?: existingCategory.image,
        )

        return categoryRepository.save(updatedCategory)
    }

    fun delete(id: Long) {
        val category = getById(id)

        // Logic check: If you are using 'ON DELETE SET NULL' in SQL,
        // this check is optional, but good for UX to warn the user.
        val bookCount = bookRepository.countByCategoryId(id)
        if (bookCount > 0) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cannot delete category: it still contains $bookCount books."
            )
        }

        categoryRepository.delete(category)
    }
}