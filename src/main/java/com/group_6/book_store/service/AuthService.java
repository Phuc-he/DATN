package com.group_6.book_store.service;

import com.group_6.book_store.dto.AuthResponseDTO;
import com.group_6.book_store.entity.User;
import com.group_6.book_store.form.UserLoginForm;
import com.group_6.book_store.form.UserRegisterForm;
import com.group_6.book_store.mapper.UserMapper;
import com.group_6.book_store.repository.UserRepository;
import com.group_6.book_store.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UserMapper userMapper;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                       UserDetailsService userDetailsService, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userMapper = userMapper;
    }

    public Object register(UserRegisterForm form) {
        // Kiểm tra username hoặc email đã tồn tại
        if (userRepository.findByUsername(form.getUsername()).isPresent()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Tài khoản đã tồn tại trên hệ thống");
            return errorResponse;
        }
        if (userRepository.findByEmail(form.getEmail()).isPresent()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Tài khoản đã tồn tại trên hệ thống");
            return errorResponse;
        }

        // Ánh xạ từ form sang entity và mã hóa mật khẩu
        User user = userMapper.toEntity(form);
        user.setPassword(passwordEncoder.encode(form.getPassword()));
        try {
            user.setRole(User.Role.valueOf(form.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            user.setRole(User.Role.CUSTOMER); // Mặc định là CUSTOMER nếu role không hợp lệ
        }
        user = userRepository.save(user);

        // Tạo token JWT
        String accessToken = jwtUtil.generateAccessToken(user.getUsername(), user.getRole().name());

        // Trả về AuthResponseDTO với định dạng yêu cầu
        return AuthResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .address(user.getAddress())
                .phone(user.getPhone())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .accessToken(accessToken)
                .build();
    }

    public AuthResponseDTO login(UserLoginForm form) {
        // Xác thực người dùng
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(form.getUsername(), form.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Lấy thông tin người dùng
        UserDetails userDetails = userDetailsService.loadUserByUsername(form.getUsername());
        User user = userRepository.findByUsername(form.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo access token
        String accessToken = jwtUtil.generateAccessToken(user.getUsername(), user.getRole().name());

        // Trả về phản hồi
        return AuthResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .fullName(user.getFullName())
                .address(user.getAddress())
                .phone(user.getPhone())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .accessToken(accessToken)
                .build();
    }
}