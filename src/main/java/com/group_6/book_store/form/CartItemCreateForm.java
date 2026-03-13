package com.group_6.book_store.form;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CartItemCreateForm {
    @NotNull(message = "Book ID is required")
    private Long bookId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}