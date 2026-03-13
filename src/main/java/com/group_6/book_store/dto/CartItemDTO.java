package com.group_6.book_store.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemDTO {
    private String bookId;
    private Integer quantity;
}