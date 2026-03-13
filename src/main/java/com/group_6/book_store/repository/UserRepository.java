package com.group_6.book_store.repository;

import com.group_6.book_store.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Page<User> findByUsernameContainingOrEmailContaining(String username, String email, Pageable pageable);
    Page<User> findByRole(User.Role role, Pageable pageable);

}