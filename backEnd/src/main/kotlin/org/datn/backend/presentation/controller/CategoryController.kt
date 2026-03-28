package org.datn.backend.presentation.controller

import org.datn.backend.domain.entity.Category
import org.datn.backend.domain.usecase.CategoryService
import org.datn.backend.presentation.mapper.toPageResponse
import org.datn.backend.presentation.mapper.toProto
import org.datn.backend.proto.CategoryPageResponse
import org.datn.backend.proto.CategoryProto
import org.datn.backend.proto.CategoryProtoList
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/categories")
class CategoryController(private val categoryService: CategoryService) {

    @GetMapping("/all", produces = ["application/x-protobuf"])
    fun getAll(pageable: Pageable): ResponseEntity<CategoryPageResponse> =
        ResponseEntity.ok(categoryService.getAll(pageable).toPageResponse())

    @GetMapping("/search", produces = ["application/x-protobuf"])
    fun search(@RequestParam query: String, pageable: Pageable): ResponseEntity<CategoryPageResponse> =
        ResponseEntity.ok(categoryService.search(query, pageable).toPageResponse())


    @GetMapping(produces = ["application/x-protobuf"])
    fun getAll(): ResponseEntity<CategoryProtoList> = ResponseEntity.ok(
        CategoryProtoList.newBuilder().addAllData(categoryService.getAll().map { it.toProto() }.toList()).build()
    )

    @GetMapping("/{id}", produces = ["application/x-protobuf"])
    fun getById(@PathVariable id: Long): ResponseEntity<CategoryProto> =
        ResponseEntity.ok(categoryService.getById(id).toProto())

    @PostMapping(consumes = ["application/x-protobuf"], produces = ["application/x-protobuf"])
    fun create(@RequestBody proto: CategoryProto): ResponseEntity<CategoryProto> {
        val entity = Category(
            name = proto.name,
            description = proto.description,
            image = proto.image,
        )
        val saved = categoryService.create(entity)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved?.toProto())
    }

    @PatchMapping("/{id}", consumes = ["application/json"], produces = ["application/x-protobuf"])
    fun update(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<CategoryProto> = ResponseEntity.ok(categoryService.update(id, updates)?.toProto())

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Unit> {
        categoryService.delete(id)
        return ResponseEntity.noContent().build()
    }
}