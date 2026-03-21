package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.Book
import org.datn.backend.domain.repository.BookRepository
import org.datn.backend.domain.repository.AuthorRepository
import org.datn.backend.domain.repository.CategoryRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal

@Service
class BookService(
    private val bookRepository: BookRepository,
    private val authorRepository: AuthorRepository,
    private val categoryRepository: CategoryRepository
) {

    fun create(book: Book): Book {
        // Business Logic: Verify Author exists before linking
        book.author?.id?.let { authorId ->
            if (!authorRepository.existsById(authorId)) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Author not found")
            }
        }

        // Business Logic: Verify Category exists before linking
        book.category?.id?.let { categoryId ->
            if (!categoryRepository.existsById(categoryId)) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found")
            }
        }

        return bookRepository.save(book)
    }

    fun getAll(): List<Book> = bookRepository.findAll()

    fun getAll(pageable: Pageable): Page<Book> = bookRepository.findByPage(pageable)

    fun getBooksByAuthor(authorId: Long, pageable: Pageable): Page<Book> = bookRepository.findByAuthorId(authorId, pageable)

    fun search(query: String, pageable: Pageable): Page<Book> = bookRepository.search(query, pageable)

    fun update(id: Long, updates: Map<String, Any>): Book {
        val existingBook = bookRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found") }

        // Logic to update specific fields using Kotlin's .copy()
        val updatedBook = existingBook.copy(
            title = updates["title"] as? String ?: existingBook.title,
            description = updates["description"] as? String ?: existingBook.description,
            price = (updates["price"] as? Number)?.toDouble()?.let { BigDecimal.valueOf(it) } ?: existingBook.price,
            stock = updates["stock"] as? Int ?: existingBook.stock,
            discount = (updates["discount"] as? Number)?.toDouble()?.let { BigDecimal.valueOf(it) } ?: existingBook.discount,
            imageUrl = updates["imageUrl"] as? String ?: existingBook.imageUrl
        )

        return bookRepository.save(updatedBook)
    }

    fun delete(id: Long) {
        if (!bookRepository.existsById(id)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found")
        }
        bookRepository.deleteById(id)
    }
}