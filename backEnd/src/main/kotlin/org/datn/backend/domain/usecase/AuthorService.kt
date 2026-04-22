package org.datn.backend.domain.usecase

import org.datn.backend.domain.entity.Author
import org.datn.backend.domain.entity.LogAction
import org.datn.backend.domain.repository.AuthorRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.util.Optional

@Service
class AuthorService(
    private val authorRepository: AuthorRepository,
    private val activityLogService: ActivityLogService,
) {
    fun getById(id: Long): Optional<Author?>? = authorRepository.findById(id).filter { !it.isDeleted }

    fun getAll(): List<Author> = authorRepository.findAllByIsDeletedFalse()

    fun getAll(pageable: Pageable): Page<Author> = authorRepository.findByPage(pageable)

    fun search(
        query: String,
        pageable: Pageable,
    ): Page<Author> = authorRepository.search(query, pageable)

    fun create(authorRequest: Author): Author? =
        activityLogService.executeWithLog(LogAction.CREATE.name, "Author") {
            if (authorRepository.existsByName(authorRequest.name)) {
                throw ResponseStatusException(HttpStatus.CONFLICT, "Author name already exists")
            }
            authorRepository.save(authorRequest)
        }

    fun update(
        id: Long,
        updates: Map<String, Any>,
    ): Author? =
        activityLogService.executeWithLog(LogAction.UPDATE.name, "Author") {
            val existingAuthor =
                authorRepository
                    .findById(id)
                    .filter { !it.isDeleted }
                    .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }

            // Logic to update only specific fields like 'bio' or 'profileImage'
            val updatedAuthor =
                existingAuthor.copy(
                    bio = updates["bio"] as? String ?: existingAuthor.bio,
                    profileImage = updates["profileImage"] as? String ?: existingAuthor.profileImage,
                )
            authorRepository.save(updatedAuthor)
        }

    fun delete(id: Long) =
        activityLogService.executeWithLog(LogAction.DELETE.name, "Author") {
            val author =
                authorRepository
                    .findById(id)
                    .filter { !it.isDeleted }
                    .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }
            // Custom check: If this author has books, prevent deletion or handle cascade
            // (This would involve calling bookRepository.countByAuthorId(id))
            authorRepository.save(author.copy(isDeleted = true))
        }
}
