package com.group_6.book_store.form;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserRegisterForm {
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @NotBlank
    @Size(min = 6, max = 255)
    private String password;

    @NotBlank
    private String role;

    @Size(max = 100)
    private String fullName;

    private String address;

    @Size(max = 20)
    private String phone;
}