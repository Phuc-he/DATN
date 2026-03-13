package com.group_6.book_store.controller;

import com.group_6.book_store.dto.AuthResponseDTO;
import com.group_6.book_store.dto.UserDTO;
import com.group_6.book_store.form.UserLoginForm;
import com.group_6.book_store.form.UserRegisterForm;
import com.group_6.book_store.form.UserUpdateForm;
import com.group_6.book_store.service.AuthService;
import com.group_6.book_store.service.UserServiceV2;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v2")
public class UserControllerV2 {

    private final UserServiceV2 userServiceV2;
    private final AuthService authService;

    public UserControllerV2(UserServiceV2 userServiceV2, AuthService authService) {
        this.userServiceV2 = userServiceV2;
        this.authService = authService;
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserDTO>> getAllUsers(Pageable pageable) {
        Page<UserDTO> users = userServiceV2.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/search")
    public ResponseEntity<Page<UserDTO>> searchUsers(@RequestParam String searchTerm, Pageable pageable) {
        Page<UserDTO> users = userServiceV2.searchUsers(searchTerm, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userServiceV2.getUser(id);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateForm form) {
        UserDTO user = userServiceV2.updateUser(id, form);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userServiceV2.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/users/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterForm form) {
        Object response = authService.register(form);
        if (response instanceof Map && ((Map<?, ?>) response).containsKey("message")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUserByAdmin(@Valid @RequestBody UserRegisterForm form) {
        Object response = authService.register(form);
        if (response instanceof Map && ((Map<?, ?>) response).containsKey("message")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginForm form) {
        try {
            AuthResponseDTO response = authService.login(form);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Đăng nhập thất bại: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/users/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserDTO>> getUsersByRole(@RequestParam String role, Pageable pageable) {
        Page<UserDTO> users = userServiceV2.getUsersByRole(role, pageable);
        return ResponseEntity.ok(users);
    }
}