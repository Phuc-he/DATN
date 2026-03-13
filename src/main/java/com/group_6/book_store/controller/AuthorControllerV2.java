package com.group_6.book_store.controller;

import com.group_6.book_store.dto.AuthorDTO;
import com.group_6.book_store.form.AuthorCreateForm;
import com.group_6.book_store.form.AuthorUpdateForm;
import com.group_6.book_store.service.AuthorServiceV2;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2")
public class AuthorControllerV2 {

    private final AuthorServiceV2 authorServiceV2;

    public AuthorControllerV2(AuthorServiceV2 authorServiceV2) {
        this.authorServiceV2 = authorServiceV2;
    }

    @GetMapping("/authors")
    public ResponseEntity<Page<AuthorDTO>> getAllAuthors(Pageable pageable) {
        Page<AuthorDTO> authors = authorServiceV2.getAllAuthors(pageable);
        return ResponseEntity.ok(authors);
    }

    @GetMapping("/authors/search")
    public ResponseEntity<Page<AuthorDTO>> searchAuthors(@RequestParam String searchTerm, Pageable pageable) {
        Page<AuthorDTO> authors = authorServiceV2.searchAuthors(searchTerm, pageable);
        return ResponseEntity.ok(authors);
    }

    @GetMapping("/authors/{id}")
    public ResponseEntity<AuthorDTO> getAuthor(@PathVariable Long id) {
        AuthorDTO author = authorServiceV2.getAuthor(id);
        return ResponseEntity.ok(author);
    }

    @PostMapping("/authors")
    public ResponseEntity<AuthorDTO> createAuthor(@Valid @RequestBody AuthorCreateForm form) {
        AuthorDTO author = authorServiceV2.createAuthor(form);
        return ResponseEntity.ok(author);
    }

    @PatchMapping("/authors/{id}")
    public ResponseEntity<AuthorDTO> updateAuthor(@PathVariable Long id, @Valid @RequestBody AuthorUpdateForm form) {
        AuthorDTO author = authorServiceV2.updateAuthor(id, form);
        return ResponseEntity.ok(author);
    }

    @DeleteMapping("/authors/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable Long id) {
        authorServiceV2.deleteAuthor(id);
        return ResponseEntity.noContent().build();
    }
}