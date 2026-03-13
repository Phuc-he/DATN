package com.group_6.book_store.form;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryUpdateForm {
    @Size(max = 50, message = "Name must not exceed 50 characters")
    private String name;

    private String description;
}
