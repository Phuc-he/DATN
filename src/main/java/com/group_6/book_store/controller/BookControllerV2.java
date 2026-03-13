package com.group_6.book_store.controller;

import com.group_6.book_store.dto.BookDTO;
import com.group_6.book_store.form.BookCreateForm;
import com.group_6.book_store.form.BookUpdateForm;
import com.group_6.book_store.service.BookServiceV2;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2")
public class BookControllerV2 {

    private final BookServiceV2 bookServiceV2;

    public BookControllerV2(BookServiceV2 bookServiceV2) {
        this.bookServiceV2 = bookServiceV2;
    }

    @GetMapping("/books")
    public ResponseEntity<Page<BookDTO>> getAllBooks(Pageable pageable) {
        Page<BookDTO> books = bookServiceV2.getAllBooks(pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/books/search")
    public ResponseEntity<Page<BookDTO>> searchBooks(@RequestParam String searchTerm, Pageable pageable) {
        Page<BookDTO> books = bookServiceV2.searchBooks(searchTerm, pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/books/category/{categoryId}")
    public ResponseEntity<Page<BookDTO>> getBooksByCategory(@PathVariable Long categoryId, Pageable pageable) {
        Page<BookDTO> books = bookServiceV2.getBooksByCategory(categoryId, pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/books/{id}")
    public ResponseEntity<BookDTO> getBook(@PathVariable Long id) {
        BookDTO book = bookServiceV2.getBook(id);
        return ResponseEntity.ok(book);
    }

    @PostMapping("/books")
    public ResponseEntity<BookDTO> createBook(@Valid @RequestBody BookCreateForm form) {
        BookDTO book = bookServiceV2.createBook(form);
        return ResponseEntity.ok(book);
    }

    @PatchMapping("/books/{id}")
    public ResponseEntity<BookDTO> updateBook(@PathVariable Long id, @Valid @RequestBody BookUpdateForm form) {
        BookDTO book = bookServiceV2.updateBook(id, form);
        return ResponseEntity.ok(book);
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookServiceV2.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}