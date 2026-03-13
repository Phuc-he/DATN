package com.group_6.book_store.dto;

import com.group_6.book_store.entity.Order;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private Long userId;
    private UserInfo userInfo;
    private String cartId;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemDTO> orderItems;

    @Data
    public static class UserInfo {
        private String fullName;
        private String phone;
        private String address;
    }
}