package com.group_6.book_store.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter

public class ReviewDTO {
    private Long id;
    private Long userId;
    private Long bookId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}