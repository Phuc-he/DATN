package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.Author
import org.datn.backend.domain.usecase.AuthorService
import org.datn.backend.proto.AuthorPageResponse
import org.datn.backend.proto.AuthorProto
import org.datn.backend.proto.AuthorProtoList
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/authors")
class AuthorController(private val authorService: AuthorService) {

    /**
     * GET /api/authors
     * Returns a list of authors in Protobuf format
     */
    @GetMapping(produces = ["application/x-protobuf"])
    fun getAllAuthors(): ResponseEntity<AuthorProtoList> {
        val authors = authorService.getAll()
        val protoList = authors.map { it.toProto() }
        return ResponseEntity.ok(AuthorProtoList.newBuilder().addAllData(protoList).build())
    }

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<AuthorPageResponse> {
        val authors = authorService.getAll(pageable)
        return ResponseEntity.ok(toPageResponse(authors))
    }

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(@RequestParam query: String, pageable: Pageable): ResponseEntity<AuthorPageResponse> {
        val authors = authorService.search(query, pageable)
        return ResponseEntity.ok(toPageResponse(authors))
    }

    /**
     * POST /api/authors
     * Receives Protobuf binary and creates an author
     */
    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun createAuthor(@RequestBody authorProto: AuthorProto): ResponseEntity<AuthorProto> {
        val entity = Author(
            name = authorProto.name,
            bio = authorProto.bio,
            profileImage = authorProto.profileImage
        )
        val savedAuthor = authorService.create(entity)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAuthor.toProto())
    }

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun updateAuthor(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<AuthorProto> {
        val updatedAuthor = authorService.update(id, updates)
        return ResponseEntity.ok(updatedAuthor.toProto())
    }

    @DeleteMapping("/{id}")
    fun deleteAuthor(@PathVariable id: Long): ResponseEntity<Unit> {
        authorService.delete(id)
        return ResponseEntity.noContent().build()
    }

    // --- Extension Function for Mapping ---
    private fun Author.toProto(): AuthorProto {
        return AuthorProto.newBuilder()
            .setId(this.id ?: 0L)
            .setName(this.name)
            .setBio(this.bio ?: "")
            .setProfileImage(this.profileImage ?: "")
            .build()
    }

    private fun toPageResponse(authors: Page<Author>): AuthorPageResponse = AuthorPageResponse.newBuilder()
        .addAllContent(authors.content.map { it.toProto() })
        .setTotalElements(authors.totalElements)
        .setTotalPages(authors.totalPages)
        .setPageNumber(authors.number)
        .setPageSize(authors.size)
        .build()
}