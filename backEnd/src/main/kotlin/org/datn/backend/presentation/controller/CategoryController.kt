package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.Category
import org.datn.backend.domain.usecase.CategoryService
import org.datn.backend.proto.CategoryPageResponse
import org.datn.backend.proto.CategoryProto
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/categories")
class CategoryController(private val categoryService: CategoryService) {

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
    fun getAll(): ResponseEntity<List<CategoryProto>> {
        val categories = categoryService.getAll()
        val protoList = categories.map { it.toProto() }
        return ResponseEntity.ok(protoList)
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
            description = proto.description
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