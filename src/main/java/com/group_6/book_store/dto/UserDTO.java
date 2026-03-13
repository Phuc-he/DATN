package com.group_6.book_store.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserDTO {
  private Long id;
  private String username;
  private String email;
  private String role;
  private String fullName;
  private String address;
  private String phone;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}