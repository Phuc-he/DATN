package com.group_6.book_store.service;

import com.group_6.book_store.dto.AuthorPostDTO;
import com.group_6.book_store.entity.Author;
import com.group_6.book_store.entity.AuthorPost;
import com.group_6.book_store.form.AuthorPostCreateForm;
import com.group_6.book_store.form.AuthorPostUpdateForm;
import com.group_6.book_store.mapper.AuthorPostMapper;
import com.group_6.book_store.repository.AuthorPostRepository;
import com.group_6.book_store.repository.AuthorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthorPostServiceV2 {

    private final AuthorPostRepository authorPostRepository;
    private final AuthorRepository authorRepository;
    private final AuthorPostMapper authorPostMapper;

    public AuthorPostServiceV2(AuthorPostRepository authorPostRepository, AuthorRepository authorRepository,
                              AuthorPostMapper authorPostMapper) {
        this.authorPostRepository = authorPostRepository;
        this.authorRepository = authorRepository;
        this.authorPostMapper = authorPostMapper;
    }

    public Page<AuthorPostDTO> getAllPosts(Pageable pageable) {
        return authorPostRepository.findAll(pageable)
                .map(authorPostMapper::toDTO);
    }

    public Page<AuthorPostDTO> searchPosts(String searchTerm, Pageable pageable) {
        return authorPostRepository.findByTitleContainingIgnoreCase(searchTerm, pageable)
                .map(authorPostMapper::toDTO);
    }

    public AuthorPostDTO getPost(Long id) {
        AuthorPost post = authorPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        return authorPostMapper.toDTO(post);
    }

    @Transactional
    public AuthorPostDTO createPost(AuthorPostCreateForm form) {
        Author author = authorRepository.findById(form.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found with id: " + form.getAuthorId()));

        AuthorPost post = authorPostMapper.toEntity(form);
        post.setAuthor(author);
        post = authorPostRepository.save(post);
        return authorPostMapper.toDTO(post);
    }

    @Transactional
    public AuthorPostDTO updatePost(Long id, AuthorPostUpdateForm form) {
        AuthorPost post = authorPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        // Chỉ cập nhật các trường được gửi trong form, các trường khác giữ nguyên
        // Nhờ nullValuePropertyMappingStrategy = IGNORE trong AuthorPostMapper
        authorPostMapper.updateEntityFromForm(form, post);
        post = authorPostRepository.save(post);
        return authorPostMapper.toDTO(post);
    }

    @Transactional
    public void deletePost(Long id) {
        if (!authorPostRepository.existsById(id)) {
            throw new RuntimeException("Post not found with id: " + id);
        }
        authorPostRepository.deleteById(id);
    }
}