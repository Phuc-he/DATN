package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.Author
import org.datn.backend.domain.repository.AuthorRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class AuthorService(private val authorRepository: AuthorRepository) {

    fun getAll(): List<Author> = authorRepository.findAll()

    fun getAll(pageable: Pageable): Page<Author> = authorRepository.findByPage(pageable)

    fun search(query: String, pageable: Pageable): Page<Author> = authorRepository.search(query, pageable)

    fun create(authorRequest: Author): Author {
        if (authorRepository.existsByName(authorRequest.name)) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Author name already exists")
        }
        return authorRepository.save(authorRequest)
    }

    fun update(id: Long, updates: Map<String, Any>): Author {
        val existingAuthor = authorRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }

        // Logic to update only specific fields like 'bio' or 'profileImage'
        val updatedAuthor = existingAuthor.copy(
            bio = updates["bio"] as? String ?: existingAuthor.bio,
            profileImage = updates["profileImage"] as? String ?: existingAuthor.profileImage
        )
        return authorRepository.save(updatedAuthor)
    }

    fun delete(id: Long) {
        val author = authorRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }

        // Custom check: If this author has books, prevent deletion or handle cascade
        // (This would involve calling bookRepository.countByAuthorId(id))

        authorRepository.delete(author)
    }
}