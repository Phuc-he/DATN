//package com.group_6.book_store.service;
//
//import com.group_6.book_store.dto.CartDTO;
//import com.group_6.book_store.entity.Book;
//import com.group_6.book_store.entity.Cart;
//import com.group_6.book_store.entity.CartItem;
//import com.group_6.book_store.entity.User;
//import com.group_6.book_store.form.CartItemCreateForm;
//import com.group_6.book_store.form.CartItemUpdateForm;
//import com.group_6.book_store.mapper.CartMapper;
//import com.group_6.book_store.repository.BookRepository;
//import com.group_6.book_store.repository.CartRepository;
//import com.group_6.book_store.repository.UserRepository;
//import org.springframework.security.access.AccessDeniedException;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.Collections;
//import java.util.List;
//
//@Service
//public class CartService {
//
//    private final CartRepository cartRepository;
//    private final UserRepository userRepository;
//    private final BookRepository bookRepository;
//    private final CartMapper cartMapper;
//
//    public CartService(CartRepository cartRepository, UserRepository userRepository,
//                       BookRepository bookRepository, CartMapper cartMapper) {
//        this.cartRepository = cartRepository;
//        this.userRepository = userRepository;
//        this.bookRepository = bookRepository;
//        this.cartMapper = cartMapper;
//    }
//
//    public List<CartDTO> getAllCarts() {
//        if (!hasRole("CUSTOMER")) {
//            throw new AccessDeniedException("Only CUSTOMER can access cart");
//        }
//
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found: " + username));
//
//        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
//                .orElseGet(() -> createCartForUser(user));
//
//        return Collections.singletonList(cartMapper.toDTO(cart));
//    }
//
//    @Transactional
//    public List<CartDTO> addItemToCart(CartItemCreateForm form) {
//        if (!hasRole("CUSTOMER")) {
//            throw new AccessDeniedException("Only CUSTOMER can add items to cart");
//        }
//
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found: " + username));
//
//        Cart cart = cartRepository.findByUserId(user.getId())
//                .orElseGet(() -> createCartForUser(user));
//
//        Book book = bookRepository.findById(Long.valueOf(form.getBookId()))
//                .orElseThrow(() -> new RuntimeException("Book not found with id: " + form.getBookId()));
//
//        if (book.getStock() < form.getQuantity()) {
//            throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
//        }
//
//        CartItem existingItem = cart.getCartItems().stream()
//                .filter(item -> item.getBook().getId().equals(Long.valueOf(form.getBookId())))
//                .findFirst()
//                .orElse(null);
//
//        if (existingItem != null) {
//            existingItem.setQuantity(existingItem.getQuantity() + form.getQuantity());
//            if (book.getStock() < existingItem.getQuantity()) {
//                throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
//            }
//        } else {
//            CartItem cartItem = cartMapper.toCartItemEntity(form);
//            cartItem.setCart(cart);
//            cartItem.setBook(book);
//            cart.getCartItems().add(cartItem);
//        }
//
//        cart = cartRepository.save(cart);
//        return Collections.singletonList(cartMapper.toDTO(cart));
//    }
//
//    @Transactional
//    public List<CartDTO> updateCartItem(String bookId, CartItemUpdateForm form) {
//        if (!hasRole("CUSTOMER")) {
//            throw new AccessDeniedException("Only CUSTOMER can update cart items");
//        }
//
//        // Validate bookId
//        if (bookId == null || bookId.trim().isEmpty()) {
//            throw new IllegalArgumentException("Book ID must not be empty");
//        }
//
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found: " + username));
//
//        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
//                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + username));
//
//        CartItem cartItem = cart.getCartItems().stream()
//                .filter(item -> item.getBook().getId().equals(Long.valueOf(bookId)))
//                .findFirst()
//                .orElseThrow(() -> new RuntimeException("Cart item not found for book id: " + bookId));
//
//        Book book = cartItem.getBook();
//        if (book.getStock() < form.getQuantity()) {
//            throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
//        }
//
//        // Chỉ cập nhật quantity từ form, các trường khác (như bookId, cartId) giữ nguyên
//        // Nhờ nullValuePropertyMappingStrategy = IGNORE trong CartMapper
//        cartMapper.updateCartItemFromForm(form, cartItem);
//        cart = cartRepository.save(cart);
//        return Collections.singletonList(cartMapper.toDTO(cart));
//    }
//
//    @Transactional
//    public List<CartDTO> removeCartItem(String bookId) {
//        if (!hasRole("CUSTOMER")) {
//            throw new AccessDeniedException("Only CUSTOMER can remove cart items");
//        }
//
//        // Validate bookId
//        if (bookId == null || bookId.trim().isEmpty()) {
//            throw new IllegalArgumentException("Book ID must not be empty");
//        }
//
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found: " + username));
//
//        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
//                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + username));
//
//        CartItem cartItem = cart.getCartItems().stream()
//                .filter(item -> item.getBook().getId().equals(Long.valueOf(bookId)))
//                .findFirst()
//                .orElseThrow(() -> new RuntimeException("Cart item not found for book id: " + bookId));
//
//        cart.getCartItems().remove(cartItem);
//        cart = cartRepository.save(cart);
//        return Collections.singletonList(cartMapper.toDTO(cart));
//    }
//
//    @Transactional
//    public void clearCart() {
//        if (!hasRole("CUSTOMER")) {
//            throw new AccessDeniedException("Only CUSTOMER can clear cart");
//        }
//
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found: " + username));
//
//        Cart cart = cartRepository.findByUserId(user.getId())
//                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + username));
//
//        cart.getCartItems().clear();
//        cartRepository.save(cart);
//    }
//
//    private Cart createCartForUser(User user) {
//        Cart cart = new Cart();
//        cart.setUser(user);
//        return cartRepository.save(cart);
//    }
//
//    private boolean hasRole(String role) {
//        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
//                .stream()
//                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role));
//    }
//}