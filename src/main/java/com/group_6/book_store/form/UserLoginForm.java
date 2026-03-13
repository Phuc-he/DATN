package com.group_6.book_store.form;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginForm {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}