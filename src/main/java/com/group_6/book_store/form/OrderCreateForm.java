package com.group_6.book_store.form;

import com.group_6.book_store.entity.Order;
import lombok.Data;

import java.util.List;

@Data
public class OrderCreateForm {
    private String fullName;
    private String phone;
    private String address;
    private String cartId;
    private List<OrderItemForm> orderItems;
}