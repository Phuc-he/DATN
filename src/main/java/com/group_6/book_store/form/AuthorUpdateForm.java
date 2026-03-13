package com.group_6.book_store.form;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthorUpdateForm {
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    private String bio;

    @Size(max = 255, message = "Profile image URL must not exceed 255 characters")
    private String profileImage;
}