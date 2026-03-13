//package com.group_6.book_store.controller;
//
//import com.group_6.book_store.dto.OrderDTO;
//import com.group_6.book_store.form.OrderCreateForm;
//import com.group_6.book_store.form.OrderStatusUpdateForm;
//import com.group_6.book_store.service.OrderService;
//import jakarta.validation.Valid;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/v1/orders")
//public class OrderController {
//
//    private final OrderService orderService;
//
//    public OrderController(OrderService orderService) {
//        this.orderService = orderService;
//    }
//
//    @GetMapping
//    public ResponseEntity<Page<OrderDTO>> getAllOrders(Pageable pageable) {
//        Page<OrderDTO> orders = orderService.getAllOrders(pageable);
//        return ResponseEntity.ok(orders);
//    }
//
//    @GetMapping("/me")
//    public ResponseEntity<Page<OrderDTO>> getMyOrders(Pageable pageable) {
//        Page<OrderDTO> orders = orderService.getMyOrders(pageable);
//        return ResponseEntity.ok(orders);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long id) {
//        OrderDTO order = orderService.getOrder(id);
//        return ResponseEntity.ok(order);
//    }
//
//    @PostMapping
//    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderCreateForm form) {
//        OrderDTO order = orderService.createOrder(form);
//        return ResponseEntity.ok(order);
//    }
//
//    @PostMapping("/from-cart")
//    public ResponseEntity<OrderDTO> createOrderFromCart(@RequestParam String shippingAddress) {
//        OrderDTO order = orderService.createOrderFromCart(shippingAddress);
//        return ResponseEntity.ok(order);
//    }
//
//    @PutMapping("/{id}/status")
//    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdateForm form) {
//        OrderDTO order = orderService.updateOrderStatus(id, form);
//        return ResponseEntity.ok(order);
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
//        orderService.deleteOrder(id);
//        return ResponseEntity.noContent().build();
//    }
//}