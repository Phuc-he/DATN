package com.group_6.book_store.form;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CartItemUpdateForm {
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}