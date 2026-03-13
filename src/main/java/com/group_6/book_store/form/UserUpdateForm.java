package com.group_6.book_store.form;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateForm {
    @Size(max = 100)
    private  String username;
    @Size(max = 100)
    private String fullName;

    private String address;

    @Size(max = 20)
    private String phone;

    @Email
    @Size(max = 100)
    private String email;
}