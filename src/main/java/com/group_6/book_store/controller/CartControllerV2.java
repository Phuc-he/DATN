package com.group_6.book_store.controller;

import com.group_6.book_store.dto.TempCartDTO;
import com.group_6.book_store.dto.UserCartDTO;
import com.group_6.book_store.entity.User;
import com.group_6.book_store.form.CartItemCreateForm;
import com.group_6.book_store.form.CartItemUpdateForm;
import com.group_6.book_store.service.CartServiceV2;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2")
public class CartControllerV2 {

    private final CartServiceV2 cartServiceV2;

    public CartControllerV2(CartServiceV2 cartServiceV2) {
        this.cartServiceV2 = cartServiceV2;
    }

    // Xem giỏ hàng (chưa đăng nhập)
    @GetMapping("/carts/anonymous")
    public ResponseEntity<TempCartDTO> getAnonymousCart(HttpServletRequest request, HttpServletResponse response) {
        TempCartDTO cart = cartServiceV2.getAnonymousCart(request, response);
        return ResponseEntity.ok(cart);
    }

    // Xem giỏ hàng (theo userId, đã đăng nhập)
    @GetMapping("/carts/{userId}")
    public ResponseEntity<UserCartDTO> getUserCart(@PathVariable Long userId, HttpServletRequest request, HttpServletResponse response) {
        UserCartDTO cart = cartServiceV2.getUserCart(userId, request, response);
        return ResponseEntity.ok(cart);
    }

    // Thêm sách vào giỏ hàng (chưa đăng nhập)
    @PostMapping("/carts/anonymous/items")
    public ResponseEntity<TempCartDTO> addItemToAnonymousCart(@Valid @RequestBody CartItemCreateForm form, HttpServletRequest request, HttpServletResponse response) {
        TempCartDTO cart = cartServiceV2.addItemToAnonymousCart(form, request, response);
        return ResponseEntity.ok(cart);
    }

    // Cập nhật sách trong giỏ hàng (chưa đăng nhập)
    @PatchMapping("/carts/anonymous/items/{bookId}")
    public ResponseEntity<TempCartDTO> updateItemInAnonymousCart(@PathVariable String bookId, @Valid @RequestBody CartItemUpdateForm form, HttpServletRequest request, HttpServletResponse response) {
        TempCartDTO cart = cartServiceV2.updateItemInAnonymousCart(bookId, form, request, response);
        return ResponseEntity.ok(cart);
    }

    // Xóa sách khỏi giỏ hàng (chưa đăng nhập)
    @DeleteMapping("/carts/anonymous/items/{bookId}")
    public ResponseEntity<TempCartDTO> removeItemFromAnonymousCart(@PathVariable String bookId, HttpServletRequest request, HttpServletResponse response) {
        TempCartDTO cart = cartServiceV2.removeItemFromAnonymousCart(bookId, request, response);
        return ResponseEntity.ok(cart);
    }

    // Thêm sách vào giỏ hàng (theo userId, đã đăng nhập)
    @PostMapping("/carts/{userId}/items")
    public ResponseEntity<UserCartDTO> addItemToUserCart(@PathVariable Long userId, @Valid @RequestBody CartItemCreateForm form, HttpServletRequest request, HttpServletResponse response) {
        UserCartDTO cart = cartServiceV2.addItemToUserCart(userId, form, request, response);
        return ResponseEntity.ok(cart);
    }

    // Cập nhật sách trong giỏ hàng (theo userId, đã đăng nhập)
    @PatchMapping("/carts/{userId}/items/{bookId}")
    public ResponseEntity<UserCartDTO> updateItemInUserCart(@PathVariable Long userId, @PathVariable String bookId, @Valid @RequestBody CartItemUpdateForm form, HttpServletRequest request, HttpServletResponse response) {
        UserCartDTO cart = cartServiceV2.updateItemInUserCart(userId, bookId, form, request, response);
        return ResponseEntity.ok(cart);
    }

    // Xóa sách khỏi giỏ hàng (theo userId, đã đăng nhập)
    @DeleteMapping("/carts/{userId}/items/{bookId}")
    public ResponseEntity<UserCartDTO> removeItemFromUserCart(@PathVariable Long userId, @PathVariable String bookId, HttpServletRequest request, HttpServletResponse response) {
        UserCartDTO cart = cartServiceV2.removeItemFromUserCart(userId, bookId, request, response);
        return ResponseEntity.ok(cart);
    }

    // Xóa toàn bộ giỏ hàng (tạm thời hoặc của user)
    @DeleteMapping("/carts")
    public ResponseEntity<Void> clearCart(HttpServletRequest request, HttpServletResponse response) {
        User user = cartServiceV2.getCurrentUser();
        if (user != null) {
            cartServiceV2.clearUserCart(user.getId(), request, response);
        } else {
            cartServiceV2.clearAnonymousCart(request, response);
        }
        return ResponseEntity.noContent().build();
    }

    // Tạo giỏ hàng rỗng (tạm thời khi đăng xuất hoặc truy cập mới)
    @PostMapping("/carts/create")
    public ResponseEntity<TempCartDTO> createEmptyCart(HttpServletRequest request, HttpServletResponse response) {
        TempCartDTO cart = cartServiceV2.createEmptyCart(request, response);
        return ResponseEntity.ok(cart);
    }

    // Đồng bộ giỏ hàng từ cookie sang DB khi đăng nhập theo userId (không yêu cầu xác thực)
    @PostMapping("/carts/{userId}/sync")
    public ResponseEntity<UserCartDTO> syncCartFromCookieToDB(@PathVariable Long userId, HttpServletRequest request, HttpServletResponse response) {
        UserCartDTO cart = cartServiceV2.syncCartFromCookieToDB(userId, request, response);
        return ResponseEntity.ok(cart);
    }

    // Xóa giỏ hàng khi đăng xuất và tạo giỏ hàng mới
    @PostMapping("/carts/logout")
    public ResponseEntity<TempCartDTO> logoutClearCart(HttpServletRequest request, HttpServletResponse response) {
        cartServiceV2.logoutClearCart(request, response);
        return ResponseEntity.ok(cartServiceV2.createEmptyCart(request, response));
    }
}