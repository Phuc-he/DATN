package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.Author
import org.datn.backend.domain.entity.Book
import org.datn.backend.domain.entity.Category
import org.datn.backend.domain.usecase.BookService
import org.datn.backend.presentation.mapper.toEntity
import org.datn.backend.presentation.mapper.toPageResponse
import org.datn.backend.presentation.mapper.toProto
import org.datn.backend.proto.BookPageResponse
import org.datn.backend.proto.BookProto
import org.datn.backend.proto.BookProtoList
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal

@RestController
@RequestMapping("/api/books")
class BookController(private val bookService: BookService) {

    @GetMapping("/category/{categoryId}/count")
    fun getCategoryStats(@PathVariable categoryId: Long): ResponseEntity<Long> =
        ResponseEntity.ok(bookService.getCategoryStats(categoryId))

    @GetMapping(produces = ["application/x-protobuf"])
    fun getAllBooks(): ResponseEntity<BookProtoList> = ResponseEntity.ok(
        BookProtoList.newBuilder().addAllData(bookService.getAll().map { it.toProto() }).build()
    )

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<BookPageResponse> =
        ResponseEntity.ok(bookService.getAll(pageable).toPageResponse())

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(@PathVariable id: Long): ResponseEntity<BookProto> {
        val optional = bookService.getById(id)
        return if (optional.isPresent) {
            ResponseEntity.ok(optional.get().toProto())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(@RequestParam query: String, pageable: Pageable): ResponseEntity<BookPageResponse> =
        ResponseEntity.ok(bookService.search(query, pageable).toPageResponse())

    @GetMapping("/author/{authorId}", produces = ["application/x-protobuf"])
    fun getBooksByAuthor(
        @PathVariable authorId: Long,
        pageable: Pageable
    ): ResponseEntity<BookPageResponse> =
        ResponseEntity.ok(bookService.getBooksByAuthor(authorId, pageable).toPageResponse())

    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun create(@RequestBody bookProto: BookProto): ResponseEntity<BookProto> {

        val savedBook = bookService.create(bookProto.toEntity())
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBook?.toProto())
    }

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<BookProto> {
        val updatedBook = bookService.update(id, updates)
        return ResponseEntity.ok(updatedBook?.toProto())
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Unit> {
        bookService.delete(id)
        return ResponseEntity.noContent().build()
    }
}