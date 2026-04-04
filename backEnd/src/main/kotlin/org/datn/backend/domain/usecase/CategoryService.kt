package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.Category
import org.datn.backend.domain.entity.LogAction
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
    private val bookRepository: BookRepository,
    private val activityLogService: ActivityLogService, // Injected logging service
) {
    /**
     * Creates a new category and logs the action.
     */
    fun create(category: Category): Category? =
        activityLogService.executeWithLog<Category>(LogAction.CREATE.name, "Category") {
            if (categoryRepository.existsByName(category.name)) {
                throw ResponseStatusException(HttpStatus.CONFLICT, "Category already exists")
            }
            categoryRepository.save(category)
        }

    // READ operations: No logging to avoid "log spam" in dashboard
    fun getAll(): List<Category> = categoryRepository.findAll()

    fun getAll(pageable: Pageable): Page<Category> = categoryRepository.findByPage(pageable)

    fun search(
        query: String,
        pageable: Pageable,
    ): Page<Category> = categoryRepository.search(query, pageable)

    fun getById(id: Long): Category =
        categoryRepository
            .findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found") }

    /**
     * Updates an existing category and logs the action.
     */
    fun update(
        id: Long,
        updates: Map<String, Any>,
    ): Category? =
        activityLogService.executeWithLog<Category>(LogAction.UPDATE.name, "Category") {
            val existingCategory = getById(id)

            val updatedCategory =
                existingCategory.copy(
                    name = updates["name"] as? String ?: existingCategory.name,
                    description = updates["description"] as? String ?: existingCategory.description,
                    image = updates["image"] as? String ?: existingCategory.image,
                )

            categoryRepository.save(updatedCategory)
        }

    /**
     * Deletes a category and logs the action.
     * Includes a business check to ensure the category is empty.
     */
    fun delete(id: Long) =
        activityLogService.executeWithLog(LogAction.DELETE.name, "Category") {
            val category = getById(id)

            val bookCount = bookRepository.countByCategoryId(id)
            if (bookCount > 0) {
                throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot delete category: it still contains $bookCount books.",
                )
            }

            categoryRepository.delete(category)
        }
}
