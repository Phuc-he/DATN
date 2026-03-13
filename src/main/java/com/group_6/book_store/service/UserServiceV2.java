package com.group_6.book_store.service;

import com.group_6.book_store.dto.UserDTO;
import com.group_6.book_store.entity.User;
import com.group_6.book_store.form.UserUpdateForm;
import com.group_6.book_store.mapper.UserMapper;
import com.group_6.book_store.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceV2 {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceV2(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<UserDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toDTO);
    }

    public Page<UserDTO> searchUsers(String searchTerm, Pageable pageable) {
        return userRepository.findByUsernameContainingOrEmailContaining(searchTerm, searchTerm, pageable)
                .map(userMapper::toDTO);
    }

    public Page<UserDTO> getUsersByRole(String role, Pageable pageable) {
        return userRepository.findByRole(User.Role.valueOf(role.toUpperCase()), pageable)
                .map(userMapper::toDTO);
    }
    public UserDTO getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return userMapper.toDTO(user);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserUpdateForm form) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (form.getUsername() != null && !form.getUsername().equals(user.getUsername())) {
            if (userRepository.findByUsername(form.getUsername()).isPresent()) {
                throw new RuntimeException("Username already exists");
            }
        }

        userMapper.updateEntityFromForm(form, user);
        user = userRepository.save(user);
        return userMapper.toDTO(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}