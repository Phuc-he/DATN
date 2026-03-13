package com.group_6.book_store.dto;

import com.group_6.book_store.entity.Order;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO_v2 {
    
    // Thuộc tính chính theo yêu cầu
    private Long id; // id_order
    private String userName; // Tên người dùng
    private Integer totalQuantity; // Tổng số lượng sản phẩm

    // Thuộc tính vẫn cần thiết
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Giữ lại orderItems để hiển thị chi tiết nếu cần, hoặc bỏ qua
    private List<OrderItemDTO> orderItems;
    
    // Giữ lại UserInfo nếu cần thông tin giao hàng chi tiết hơn
    private UserInfo userInfo;

    @Data
    public static class UserInfo {
        private String fullName;
        private String phone;
        private String address;
    }
}