package com.group_6.book_store.controller;

import com.group_6.book_store.dto.CategoryDTO;
import com.group_6.book_store.form.CategoryCreateForm;
import com.group_6.book_store.form.CategoryUpdateForm;
import com.group_6.book_store.service.CategoryServiceV2;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2")
public class CategoryControllerV2 {

    private final CategoryServiceV2 categoryServiceV2;

    public CategoryControllerV2(CategoryServiceV2 categoryServiceV2) {
        this.categoryServiceV2 = categoryServiceV2;
    }

    @GetMapping("/categories")
    public ResponseEntity<Page<CategoryDTO>> getAllCategories(Pageable pageable) {
        Page<CategoryDTO> categories = categoryServiceV2.getAllCategories(pageable);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/categories/search")
    public ResponseEntity<Page<CategoryDTO>> searchCategories(@RequestParam String searchTerm, Pageable pageable) {
        Page<CategoryDTO> categories = categoryServiceV2.searchCategories(searchTerm, pageable);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<CategoryDTO> getCategory(@PathVariable Long id) {
        CategoryDTO category = categoryServiceV2.getCategory(id);
        return ResponseEntity.ok(category);
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryCreateForm form) {
        CategoryDTO category = categoryServiceV2.createCategory(form);
        return ResponseEntity.ok(category);
    }

    @PatchMapping("/categories/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryUpdateForm form) {
        CategoryDTO category = categoryServiceV2.updateCategory(id, form);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryServiceV2.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}