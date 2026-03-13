package com.group_6.book_store.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CartDTO {
    private String id;
    private List<CartItemDTO> bookItems;
    private String userId;
    @Data
    public static class CartItemDTO {
        private Long bookId;
        private Integer quantity;
    }
}