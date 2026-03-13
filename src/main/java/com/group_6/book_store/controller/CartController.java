//package com.group_6.book_store.controller;
//
//import com.group_6.book_store.dto.CartDTO;
//import com.group_6.book_store.form.CartItemCreateForm;
//import com.group_6.book_store.form.CartItemUpdateForm;
//import com.group_6.book_store.service.CartService;
//import jakarta.validation.Valid;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1/cart")
//public class CartController {
//
//    private final CartService cartService;
//
//    public CartController(CartService cartService) {
//        this.cartService = cartService;
//    }
//
//    @GetMapping
//    public ResponseEntity<List<CartDTO>> getAllCarts() {
//        List<CartDTO> carts = cartService.getAllCarts();
//        return ResponseEntity.ok(carts);
//    }
//
//    @PostMapping("/items")
//    public ResponseEntity<List<CartDTO>> addItemToCart(@Valid @RequestBody CartItemCreateForm form) {
//        List<CartDTO> carts = cartService.addItemToCart(form);
//        return ResponseEntity.ok(carts);
//    }
//
//    @PatchMapping("/items/{bookId}")
//    public ResponseEntity<List<CartDTO>> updateCartItem(@PathVariable String bookId, @Valid @RequestBody CartItemUpdateForm form) {
//        // Chỉ cập nhật quantity được gửi trong form, các trường khác giữ nguyên
//        List<CartDTO> carts = cartService.updateCartItem(bookId, form);
//        return ResponseEntity.ok(carts);
//    }
//
//    @DeleteMapping("/items/{bookId}")
//    public ResponseEntity<List<CartDTO>> removeCartItem(@PathVariable String bookId) {
//        List<CartDTO> carts = cartService.removeCartItem(bookId);
//        return ResponseEntity.ok(carts);
//    }
//
//    @DeleteMapping
//    public ResponseEntity<Void> clearCart() {
//        cartService.clearCart();
//        return ResponseEntity.noContent().build();
//    }
//}