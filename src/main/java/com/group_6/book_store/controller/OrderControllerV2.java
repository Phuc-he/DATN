package com.group_6.book_store.controller;

import com.group_6.book_store.dto.OrderDTO;
import com.group_6.book_store.dto.OrderDTO_v2;
import com.group_6.book_store.form.OrderCreateForm;
import com.group_6.book_store.form.OrderStatusUpdateForm;
import com.group_6.book_store.service.OrderServiceV2;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2")
public class OrderControllerV2 {

    private final OrderServiceV2 orderServiceV2;

    public OrderControllerV2(OrderServiceV2 orderServiceV2) {
        this.orderServiceV2 = orderServiceV2;
    }

    @GetMapping("/orders/users/{userId}")
    public ResponseEntity<Page<OrderDTO>> getOrdersByUserId(@PathVariable Long userId, Pageable pageable) {
        Page<OrderDTO> orders = orderServiceV2.getOrdersByUserId(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderCreateForm form, @RequestParam Long userId) {
        OrderDTO order = orderServiceV2.createOrder(userId, form);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/orders") // Endpoint lấy tất cả đơn hàng
    public ResponseEntity<Page<OrderDTO_v2>> getAllOrders(Pageable pageable) {
        Page<OrderDTO_v2> orders = orderServiceV2.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @DeleteMapping("/orders/{orderId}") // Endpoint mới
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderServiceV2.deleteOrder(orderId);
        return ResponseEntity.noContent().build(); // Trả về 204 No Content khi xóa thành công
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderDTO_v2> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody @Valid OrderStatusUpdateForm form) {

        // Gọi Service để cập nhật trạng thái đơn hàng
        OrderDTO_v2 updatedOrder = orderServiceV2.updateOrderStatus(orderId, form);

        // Trả về đơn hàng đã được cập nhật với mã trạng thái 200 OK
        return ResponseEntity.ok(updatedOrder);
    }
}