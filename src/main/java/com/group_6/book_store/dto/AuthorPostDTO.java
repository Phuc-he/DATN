package com.group_6.book_store.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuthorPostDTO {
    private Long id;
    private String title;
    private String content;
    private Long authorId;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}