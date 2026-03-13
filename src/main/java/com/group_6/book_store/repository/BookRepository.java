package com.group_6.book_store.repository;

import com.group_6.book_store.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {
    // Lấy tất cả sách kèm thông tin category và author
    @Query("SELECT b FROM Book b LEFT JOIN FETCH b.category LEFT JOIN FETCH b.author")
    Page<Book> findAllWithDetails(Pageable pageable);

    // Tìm sách theo tiêu đề (không phân biệt hoa thường), kèm thông tin category và author
    @Query("SELECT b FROM Book b LEFT JOIN FETCH b.category LEFT JOIN FETCH b.author WHERE UPPER(b.title) LIKE UPPER(CONCAT('%', :title, '%'))")
    Page<Book> findByTitleContainingIgnoreCase(@Param("title") String title, Pageable pageable);

    // Tìm sách theo categoryId, kèm thông tin category và author
    @Query("SELECT b FROM Book b LEFT JOIN FETCH b.category LEFT JOIN FETCH b.author WHERE b.category.id = :categoryId")
    Page<Book> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    // Tìm sách theo id, kèm thông tin category và author
    @Query("SELECT b FROM Book b LEFT JOIN FETCH b.category LEFT JOIN FETCH b.author WHERE b.id = :id")
    Book findByIdWithDetails(@Param("id") Long id);
}