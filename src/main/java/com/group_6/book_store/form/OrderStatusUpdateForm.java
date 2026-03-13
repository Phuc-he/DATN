package com.group_6.book_store.form;

import com.group_6.book_store.entity.Order;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusUpdateForm {
    @NotNull(message = "Status is required")
    private Order.OrderStatus status;
}