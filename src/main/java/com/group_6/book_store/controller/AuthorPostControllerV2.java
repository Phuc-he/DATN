package com.group_6.book_store.controller;

import com.group_6.book_store.dto.AuthorPostDTO;
import com.group_6.book_store.form.AuthorPostCreateForm;
import com.group_6.book_store.form.AuthorPostUpdateForm;
import com.group_6.book_store.service.AuthorPostServiceV2;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2")
public class AuthorPostControllerV2 {

    private final AuthorPostServiceV2 authorPostServiceV2;

    public AuthorPostControllerV2(AuthorPostServiceV2 authorPostServiceV2) {
        this.authorPostServiceV2 = authorPostServiceV2;
    }

    @GetMapping("/author-posts")
    public ResponseEntity<Page<AuthorPostDTO>> getAllPosts(Pageable pageable) {
        Page<AuthorPostDTO> posts = authorPostServiceV2.getAllPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/author-posts/search")
    public ResponseEntity<Page<AuthorPostDTO>> searchPosts(@RequestParam String searchTerm, Pageable pageable) {
        Page<AuthorPostDTO> posts = authorPostServiceV2.searchPosts(searchTerm, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/author-posts/{id}")
    public ResponseEntity<AuthorPostDTO> getPost(@PathVariable Long id) {
        AuthorPostDTO post = authorPostServiceV2.getPost(id);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/author-posts")
    public ResponseEntity<AuthorPostDTO> createPost(@Valid @RequestBody AuthorPostCreateForm form) {
        AuthorPostDTO post = authorPostServiceV2.createPost(form);
        return ResponseEntity.ok(post);
    }

    @PatchMapping("/author-posts/{id}")
    public ResponseEntity<AuthorPostDTO> updatePost(@PathVariable Long id, @Valid @RequestBody AuthorPostUpdateForm form) {
        AuthorPostDTO post = authorPostServiceV2.updatePost(id, form);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/author-posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        authorPostServiceV2.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}