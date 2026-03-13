package com.group_6.book_store.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserCartDTO {
    private Long id;
    private Long userId;
    private List<CartItemDTO> cartItems;

    @Data
    public static class CartItemDTO {
        private Long bookId;
        private Integer quantity;
    }
}