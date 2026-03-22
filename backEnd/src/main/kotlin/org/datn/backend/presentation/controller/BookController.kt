package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.Author
import org.datn.backend.domain.entity.Book
import org.datn.backend.domain.entity.Category
import org.datn.backend.domain.usecase.BookService
import org.datn.backend.proto.AuthorProto
import org.datn.backend.proto.BookPageResponse
import org.datn.backend.proto.BookProto
import org.datn.backend.proto.BookProtoList
import org.datn.backend.proto.CategoryProto
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.time.format.DateTimeFormatter
import java.util.Date

@RestController
@RequestMapping("/api/books")
class BookController(private val bookService: BookService) {
    private val dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME
    @GetMapping(produces = ["application/x-protobuf"])
    fun getAllBooks(): ResponseEntity<BookProtoList> {
        val books = bookService.getAll()
        val protoList = books.map { it.toProto() }
        return ResponseEntity.ok(BookProtoList.newBuilder().addAllData(protoList).build())
    }

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<BookPageResponse> {
        val books = bookService.getAll(pageable)
        return ResponseEntity.ok(toPageResponse(books))
    }

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(@PathVariable id: Long,): ResponseEntity<BookProto> {
        val optional = bookService.getById(id)
        return if (optional?.isPresent == true) {
            ResponseEntity.ok(optional.get().toProto())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(@RequestParam query: String, pageable: Pageable): ResponseEntity<BookPageResponse> {
        val books = bookService.search(query, pageable)
        return ResponseEntity.ok(toPageResponse(books))
    }

    @GetMapping("/author/{authorId}", produces = ["application/x-protobuf"])
    fun getBooksByAuthor(
        @PathVariable authorId: Long,
        pageable: Pageable
    ): ResponseEntity<BookPageResponse> {
        // We use Pageable to ensure the frontend can browse through the author's catalog
        val booksPage: Page<Book> = bookService.getBooksByAuthor(authorId, pageable)
        return ResponseEntity.ok(toPageResponse(booksPage))
    }

    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun create(@RequestBody bookProto: BookProto): ResponseEntity<BookProto> {
        // Convert Proto to Entity
        val entity = Book(
            title = bookProto.title,
            description = bookProto.description,
            price = BigDecimal(bookProto.price),
            stock = bookProto.stock,
            discount = BigDecimal(bookProto.discount),
            imageUrl = bookProto.imageUrl,
            author = if (bookProto.hasAuthor()) Author(id = bookProto.author.id, name = "") else null,
            category = if (bookProto.hasCategory()) Category(id = bookProto.category.id, name = "") else null
        )

        val savedBook = bookService.create(entity)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBook.toProto())
    }

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<BookProto> {
        val updatedBook = bookService.update(id, updates)
        return ResponseEntity.ok(updatedBook.toProto())
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Unit> {
        bookService.delete(id)
        return ResponseEntity.noContent().build()
    }

    // --- Mapper Extensions ---

    private fun Book.toProto(): BookProto {
        val builder = BookProto.newBuilder()
            .setId(this.id ?: 0L)
            .setTitle(this.title)
            .setDescription(this.description ?: "")
            .setPrice(this.price.toString())
            .setStock(this.stock)
            .setDiscount(this.discount.toString())
            .setImageUrl(this.imageUrl ?: "")
            .setCreatedAt(this.createdAt?.format(dateFormatter) ?: "")

        this.author?.let {
            builder.setAuthor(AuthorProto.newBuilder().setId(it.id ?: 0L).setName(it.name).build())
        }
        this.category?.let {
            builder.setCategory(CategoryProto.newBuilder().setId(it.id ?: 0L).setName(it.name).build())
        }

        return builder.build()
    }

    private fun toPageResponse(books: Page<Book>): BookPageResponse = BookPageResponse.newBuilder()
            .addAllContent(books.content.map { it.toProto() })
            .setTotalElements(books.totalElements)
            .setTotalPages(books.totalPages)
            .setPageNumber(books.number)
            .setPageSize(books.size)
            .build()
}