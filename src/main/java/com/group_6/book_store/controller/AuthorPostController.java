package com.group_6.book_store.controller;

import com.group_6.book_store.dto.AuthorPostDTO;
import com.group_6.book_store.form.AuthorPostCreateForm;
import com.group_6.book_store.form.AuthorPostUpdateForm;
import com.group_6.book_store.service.AuthorPostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/author-posts")
public class AuthorPostController {

    private final AuthorPostService authorPostService;

    public AuthorPostController(AuthorPostService authorPostService) {
        this.authorPostService = authorPostService;
    }

    @GetMapping
    public ResponseEntity<Page<AuthorPostDTO>> getAllPosts(Pageable pageable) {
        Page<AuthorPostDTO> posts = authorPostService.getAllPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<AuthorPostDTO>> searchPosts(@RequestParam String searchTerm, Pageable pageable) {
        Page<AuthorPostDTO> posts = authorPostService.searchPosts(searchTerm, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorPostDTO> getPost(@PathVariable Long id) {
        AuthorPostDTO post = authorPostService.getPost(id);
        return ResponseEntity.ok(post);
    }

    @PostMapping
    public ResponseEntity<AuthorPostDTO> createPost(@Valid @RequestBody AuthorPostCreateForm form) {
        AuthorPostDTO post = authorPostService.createPost(form);
        return ResponseEntity.ok(post);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AuthorPostDTO> updatePost(@PathVariable Long id, @Valid @RequestBody AuthorPostUpdateForm form) {
        AuthorPostDTO post = authorPostService.updatePost(id, form);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        authorPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}