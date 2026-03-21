package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.Category
import org.datn.backend.domain.usecase.CategoryService
import org.datn.backend.proto.CategoryPageResponse
import org.datn.backend.proto.CategoryProto
import org.datn.backend.proto.CategoryProtoList
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("/api/categories")
class CategoryController(private val categoryService: CategoryService) {

    private val dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<CategoryPageResponse> {
        val categories = categoryService.getAll(pageable)
        return ResponseEntity.ok(toPageResponse(categories))
    }

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(@RequestParam query: String, pageable: Pageable): ResponseEntity<CategoryPageResponse> {
        val categories = categoryService.search(query, pageable)
        return ResponseEntity.ok(toPageResponse(categories))
    }

    @GetMapping(produces = ["application/x-protobuf"])
    fun getAll(): ResponseEntity<CategoryProtoList> {
        val categories = categoryService.getAll()
        return ResponseEntity.ok(
            CategoryProtoList.newBuilder().addAllData(categories.map { it.toProto() }.toList()).build()
        )
    }

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(@PathVariable id: Long): ResponseEntity<CategoryProto> {
        val category = categoryService.getById(id)
        return ResponseEntity.ok(category.toProto())
    }

    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun create(@RequestBody proto: CategoryProto): ResponseEntity<CategoryProto> {
        val entity = Category(
            name = proto.name,
            description = proto.description,
            image = proto.image,
        )
        val saved = categoryService.create(entity)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toProto())
    }

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<CategoryProto> {
        val updated = categoryService.update(id, updates)
        return ResponseEntity.ok(updated.toProto())
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Unit> {
        categoryService.delete(id)
        return ResponseEntity.noContent().build()
    }

    // --- Mapper ---
    private fun Category.toProto(): CategoryProto {
        return CategoryProto.newBuilder()
            .setId(this.id ?: 0L)
            .setName(this.name)
            .setDescription(this.description ?: "")
            .setCreatedAt(this.createdAt?.format(dateFormatter) ?: "")
            .setImage(this.image ?: "")
            .build()
    }

    private fun toPageResponse(categories: Page<Category>): CategoryPageResponse = CategoryPageResponse.newBuilder()
        .addAllContent(categories.content.map { it.toProto() })
        .setTotalElements(categories.totalElements)
        .setTotalPages(categories.totalPages)
        .setPageNumber(categories.number)
        .setPageSize(categories.size)
        .build()
}