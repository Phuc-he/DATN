package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.Author
import org.datn.backend.domain.usecase.AuthorService
import org.datn.backend.presentation.mapper.toPageResponse
import org.datn.backend.presentation.mapper.toProto
import org.datn.backend.proto.AuthorPageResponse
import org.datn.backend.proto.AuthorProto
import org.datn.backend.proto.AuthorProtoList
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
    fun getAllAuthors(): ResponseEntity<AuthorProtoList> =
        ResponseEntity.ok(AuthorProtoList.newBuilder().addAllData(authorService.getAll().map { it.toProto() }).build())

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<AuthorPageResponse> =
        ResponseEntity.ok(authorService.getAll(pageable).toPageResponse())

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(@RequestParam query: String, pageable: Pageable): ResponseEntity<AuthorPageResponse> =
        ResponseEntity.ok(authorService.search(query, pageable).toPageResponse())

    /**
     * POST /api/authors
     * Receives Protobuf binary and creates an author
     */
    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun createAuthor(@RequestBody authorProto: AuthorProto): ResponseEntity<AuthorProto> =
        ResponseEntity.status(HttpStatus.CREATED).body(
            authorService.create(
                Author(
                    name = authorProto.name,
                    bio = authorProto.bio,
                    profileImage = authorProto.profileImage
                )
            )?.toProto()
        )

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun updateAuthor(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<AuthorProto> = ResponseEntity.ok(authorService.update(id, updates)?.toProto())

    @DeleteMapping("/{id}")
    fun deleteAuthor(@PathVariable id: Long): ResponseEntity<Unit> {
        authorService.delete(id)
        return ResponseEntity.noContent().build()
    }
}