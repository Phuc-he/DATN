package com.group_6.book_store.form;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BookUpdateForm {
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    private Long categoryId;

    private Long authorId;

    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String imageUrl;

    @DecimalMin(value = "0.0", message = "Discount must be non-negative")
    @DecimalMax(value = "100.0", message = "Discount must not exceed 100%")
    private BigDecimal discount; // Thêm trường discount
}