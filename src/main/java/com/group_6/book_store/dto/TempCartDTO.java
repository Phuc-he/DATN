package com.group_6.book_store.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class TempCartDTO {
    private UUID id; // Có thể null cho giỏ hàng tạm thời
    private List<CartItemDTO> cartItems;

    @Data
    public static class CartItemDTO {
        private Long bookId;
        private Integer quantity;
    }
}