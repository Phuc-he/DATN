package com.group_6.book_store.form;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthorPostUpdateForm {
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    private String content;
}