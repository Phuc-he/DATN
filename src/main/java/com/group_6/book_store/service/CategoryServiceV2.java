package com.group_6.book_store.service;

import com.group_6.book_store.dto.CategoryDTO;
import com.group_6.book_store.entity.Category;
import com.group_6.book_store.form.CategoryCreateForm;
import com.group_6.book_store.form.CategoryUpdateForm;
import com.group_6.book_store.mapper.CategoryMapper;
import com.group_6.book_store.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryServiceV2 {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryServiceV2(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public Page<CategoryDTO> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable)
                .map(categoryMapper::toDTO);
    }

    public Page<CategoryDTO> searchCategories(String searchTerm, Pageable pageable) {
        return categoryRepository.findByNameContainingIgnoreCase(searchTerm, pageable)
                .map(categoryMapper::toDTO);
    }

    public CategoryDTO getCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return categoryMapper.toDTO(category);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryCreateForm form) {
        Category category = categoryMapper.toEntity(form);
        category = categoryRepository.save(category);
        return categoryMapper.toDTO(category);
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryUpdateForm form) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Chỉ cập nhật các trường được gửi trong form, các trường khác giữ nguyên
        // Nhờ nullValuePropertyMappingStrategy = IGNORE trong CategoryMapper
        categoryMapper.updateEntityFromForm(form, category);
        category = categoryRepository.save(category);
        return categoryMapper.toDTO(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
}