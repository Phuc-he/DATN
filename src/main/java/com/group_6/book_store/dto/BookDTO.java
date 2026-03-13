package com.group_6.book_store.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BookDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Long categoryId;
    private String categoryName;
    private Long authorId;
    private String authorName;
    private String imageUrl;
    private BigDecimal discount; // Thêm trường discount
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}