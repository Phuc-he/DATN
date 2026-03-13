package com.group_6.book_store.service;

import com.group_6.book_store.dto.BookDTO;
import com.group_6.book_store.entity.Book;
import com.group_6.book_store.entity.Category;
import com.group_6.book_store.entity.Author;
import com.group_6.book_store.form.BookCreateForm;
import com.group_6.book_store.form.BookUpdateForm;
import com.group_6.book_store.mapper.BookMapper;
import com.group_6.book_store.repository.BookRepository;
import com.group_6.book_store.repository.CategoryRepository;
import com.group_6.book_store.repository.AuthorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class BookServiceV2 {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final AuthorRepository authorRepository;
    private final BookMapper bookMapper;

    public BookServiceV2(BookRepository bookRepository, CategoryRepository categoryRepository,
                         AuthorRepository authorRepository, BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.authorRepository = authorRepository;
        this.bookMapper = bookMapper;
    }

    public Page<BookDTO> getAllBooks(Pageable pageable) {
        return bookRepository.findAllWithDetails(pageable)
                .map(bookMapper::toDTO);
    }

    public Page<BookDTO> getBooksByCategory(Long categoryId, Pageable pageable) {
        return bookRepository.findByCategoryId(categoryId, pageable)
                .map(bookMapper::toDTO);
    }

    public Page<BookDTO> searchBooks(String searchTerm, Pageable pageable) {
        return bookRepository.findByTitleContainingIgnoreCase(searchTerm, pageable)
                .map(bookMapper::toDTO);
    }

    public BookDTO getBook(Long id) {
        Book book = bookRepository.findByIdWithDetails(id);
        if (book == null) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        return bookMapper.toDTO(book);
    }

    @Transactional
    public BookDTO createBook(BookCreateForm form) {
        Book book = bookMapper.toEntity(form);
        // Đảm bảo discount không vượt quá 100% hoặc âm
        if (form.getDiscount() != null && (form.getDiscount().compareTo(BigDecimal.ZERO) < 0 || form.getDiscount().compareTo(new BigDecimal("100.00")) > 0)) {
            throw new IllegalArgumentException("Discount must be between 0.00 and 100.00");
        }
        if (form.getCategoryId() != null) {
            Category category = categoryRepository.findById(form.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + form.getCategoryId()));
            book.setCategory(category);
        }
        if (form.getAuthorId() != null) {
            Author author = authorRepository.findById(form.getAuthorId())
                    .orElseThrow(() -> new RuntimeException("Author not found with id: " + form.getAuthorId()));
            book.setAuthor(author);
        }
        book = bookRepository.save(book);
        return bookMapper.toDTO(book);
    }

    @Transactional
    public BookDTO updateBook(Long id, BookUpdateForm form) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        // Chỉ cập nhật các trường được gửi trong form, các trường khác giữ nguyên
        bookMapper.updateEntityFromForm(form, book);

        // Kiểm tra discount
        if (form.getDiscount() != null && (form.getDiscount().compareTo(BigDecimal.ZERO) < 0 || form.getDiscount().compareTo(new BigDecimal("100.00")) > 0)) {
            throw new IllegalArgumentException("Discount must be between 0.00 and 100.00");
        }

        // Cập nhật category nếu categoryId được gửi, nếu không thì giữ nguyên
        if (form.getCategoryId() != null) {
            Category category = categoryRepository.findById(form.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + form.getCategoryId()));
            book.setCategory(category);
        }

        // Cập nhật author nếu authorId được gửi, nếu không thì giữ nguyên
        if (form.getAuthorId() != null) {
            Author author = authorRepository.findById(form.getAuthorId())
                    .orElseThrow(() -> new RuntimeException("Author not found with id: " + form.getAuthorId()));
            book.setAuthor(author);
        }

        book = bookRepository.save(book);
        return bookMapper.toDTO(book);
    }

    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }
}