package com.group_6.book_store.repository;

import com.group_6.book_store.entity.AuthorPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuthorPostRepository extends JpaRepository<AuthorPost, Long> {
    @Query("SELECT p FROM AuthorPost p JOIN FETCH p.author")
    Page<AuthorPost> findAllWithAuthor(Pageable pageable);

    @Query("SELECT p FROM AuthorPost p JOIN FETCH p.author WHERE UPPER(p.title) LIKE UPPER(CONCAT('%', :title, '%'))")
    Page<AuthorPost> findByTitleContainingIgnoreCase(@Param("title") String title, Pageable pageable);
}