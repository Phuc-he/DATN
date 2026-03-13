package com.group_6.book_store.form;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemForm {
    private Long bookId;
    private Integer quantity;
    private BigDecimal unitPrice;
}