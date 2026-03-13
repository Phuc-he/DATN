package com.group_6.book_store.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.group_6.book_store.dto.TempCartDTO;
import com.group_6.book_store.dto.UserCartDTO;
import com.group_6.book_store.entity.Book;
import com.group_6.book_store.entity.Cart;
import com.group_6.book_store.entity.CartItem;
import com.group_6.book_store.entity.User;
import com.group_6.book_store.form.CartItemCreateForm;
import com.group_6.book_store.form.CartItemUpdateForm;
import com.group_6.book_store.mapper.CartMapper;
import com.group_6.book_store.repository.BookRepository;
import com.group_6.book_store.repository.CartRepository;
import com.group_6.book_store.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CartServiceV2 {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CartMapper cartMapper;
    private final ObjectMapper objectMapper;

    // Định nghĩa UUID mặc định cho giỏ hàng tạm thời
    private static final UUID DEFAULT_TEMP_CART_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    public CartServiceV2(CartRepository cartRepository, UserRepository userRepository,
                         BookRepository bookRepository, CartMapper cartMapper, ObjectMapper objectMapper) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.cartMapper = cartMapper;
        this.objectMapper = objectMapper;
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            String username = auth.getName();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        }
        return null;
    }

    // Xem giỏ hàng (chưa đăng nhập)
    public TempCartDTO getAnonymousCart(HttpServletRequest request, HttpServletResponse response) {
        Cart tempCart = getOrCreateTempCart(request, response);
        return cartMapper.toTempCartDTO(tempCart);
    }

    // Xem giỏ hàng (theo userId, đã đăng nhập)
    public UserCartDTO getUserCart(Long userId, HttpServletRequest request, HttpServletResponse response) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
        clearTempCartCookie(response);
        return cartMapper.toUserCartDTO(cart);
    }

    // Thêm sách vào giỏ hàng (chưa đăng nhập)
    @Transactional
    public TempCartDTO addItemToAnonymousCart(CartItemCreateForm form, HttpServletRequest request, HttpServletResponse response) {
        Cart tempCart = getOrCreateTempCart(request, response);
        Book book = bookRepository.findById(form.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + form.getBookId()));

        if (book.getStock() < form.getQuantity()) {
            throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
        }

        CartItem existingItem = tempCart.getCartItems().stream()
                .filter(item -> item.getBook().getId().equals(form.getBookId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + form.getQuantity());
            if (book.getStock() < existingItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
            }
        } else {
            CartItem cartItem = cartMapper.toCartItemEntity(form);
            cartItem.setBook(book);
            tempCart.getCartItems().add(cartItem);
        }

        updateCartCookie(tempCart, request, response);
        return cartMapper.toTempCartDTO(tempCart);
    }

    // Cập nhật sách trong giỏ hàng (chưa đăng nhập)
    @Transactional
    public TempCartDTO updateItemInAnonymousCart(String bookId, CartItemUpdateForm form, HttpServletRequest request, HttpServletResponse response) {
        if (bookId == null || bookId.trim().isEmpty()) {
            throw new IllegalArgumentException("Book ID must not be empty");
        }

        Cart tempCart = getOrCreateTempCart(request, response);
        CartItem cartItem = tempCart.getCartItems().stream()
                .filter(item -> item.getBook().getId().toString().equals(bookId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found for book id: " + bookId));

        Book book = cartItem.getBook();
        if (book.getStock() < form.getQuantity()) {
            throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
        }

        cartMapper.updateCartItemFromForm(form, cartItem);
        updateCartCookie(tempCart, request, response);
        return cartMapper.toTempCartDTO(tempCart);
    }

    // Xóa sách khỏi giỏ hàng (chưa đăng nhập)
    @Transactional
    public TempCartDTO removeItemFromAnonymousCart(String bookId, HttpServletRequest request, HttpServletResponse response) {
        if (bookId == null || bookId.trim().isEmpty()) {
            throw new IllegalArgumentException("Book ID must not be empty");
        }

        Cart tempCart = getOrCreateTempCart(request, response);
        // Chuyển bookId sang Long để so sánh chính xác hơn
        Long bookIdLong;
        try {
            bookIdLong = Long.parseLong(bookId);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid book ID format: " + bookId);
        }

        CartItem cartItem = tempCart.getCartItems().stream()
                .filter(item -> item.getBook().getId().equals(bookIdLong))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found for book id: " + bookId));

        tempCart.getCartItems().remove(cartItem);
        updateCartCookie(tempCart, request, response);
        return cartMapper.toTempCartDTO(tempCart);
    }

    // Thêm sách vào giỏ hàng (theo userId)
    @Transactional
    public UserCartDTO addItemToUserCart(Long userId, CartItemCreateForm form, HttpServletRequest request, HttpServletResponse response) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
        Book book = bookRepository.findById(form.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + form.getBookId()));

        if (book.getStock() < form.getQuantity()) {
            throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
        }

        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getBook().getId().equals(form.getBookId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + form.getQuantity());
            if (book.getStock() < existingItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
            }
        } else {
            CartItem cartItem = cartMapper.toCartItemEntity(form);
            cartItem.setBook(book);
            cartItem.setCart(cart);
            cart.getCartItems().add(cartItem);
        }

        cartRepository.save(cart);
        clearTempCartCookie(response);
        return cartMapper.toUserCartDTO(cart);
    }

    // Cập nhật sách trong giỏ hàng (theo userId)
    @Transactional
    public UserCartDTO updateItemInUserCart(Long userId, String bookId, CartItemUpdateForm form, HttpServletRequest request, HttpServletResponse response) {
        if (bookId == null || bookId.trim().isEmpty()) {
            throw new IllegalArgumentException("Book ID must not be empty");
        }

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user id: " + userId));
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getBook().getId().toString().equals(bookId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found for book id: " + bookId));

        Book book = cartItem.getBook();
        if (book.getStock() < form.getQuantity()) {
            throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
        }

        cartMapper.updateCartItemFromForm(form, cartItem);
        cartRepository.save(cart);
        clearTempCartCookie(response);
        return cartMapper.toUserCartDTO(cart);
    }

    // Xóa sách khỏi giỏ hàng (theo userId)
    @Transactional
    public UserCartDTO removeItemFromUserCart(Long userId, String bookId, HttpServletRequest request, HttpServletResponse response) {
        if (bookId == null || bookId.trim().isEmpty()) {
            throw new IllegalArgumentException("Book ID must not be empty");
        }

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user id: " + userId));
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getBook().getId().toString().equals(bookId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found for book id: " + bookId));

        cart.getCartItems().remove(cartItem);
        cartRepository.save(cart);
        clearTempCartCookie(response);
        return cartMapper.toUserCartDTO(cart);
    }

    // Xóa toàn bộ giỏ hàng (tạm thời)
    @Transactional
    public void clearAnonymousCart(HttpServletRequest request, HttpServletResponse response) {
        clearTempCartCookie(response);
    }

    // Xóa toàn bộ giỏ hàng (của user)
    @Transactional
    public void clearUserCart(Long userId, HttpServletRequest request, HttpServletResponse response) {
        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user id: " + userId));
        cart.getCartItems().clear();
        cartRepository.save(cart);
        clearTempCartCookie(response);
    }

    // Tạo giỏ hàng rỗng (tạm thời khi đăng xuất hoặc truy cập mới)
    @Transactional
    public TempCartDTO createEmptyCart(HttpServletRequest request, HttpServletResponse response) {
        clearTempCartCookie(response);
        Cart tempCart = new Cart();
        tempCart.setCartItems(new ArrayList<>());
        updateCartCookie(tempCart, request, response);
        return cartMapper.toTempCartDTO(tempCart);
    }

    // Đồng bộ giỏ hàng từ cookie sang DB theo userId (không yêu cầu xác thực)
    @Transactional
    public UserCartDTO syncCartFromCookieToDB(Long userId, HttpServletRequest request, HttpServletResponse response) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Cart cart = cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        Cart tempCart = getOrCreateTempCart(request, response);
        for (CartItem tempItem : tempCart.getCartItems()) {
            Book book = bookRepository.findById(tempItem.getBook().getId())
                    .orElseThrow(() -> new RuntimeException("Book not found with id: " + tempItem.getBook().getId()));
            if (book.getStock() >= tempItem.getQuantity()) {
                CartItem existingItem = cart.getCartItems().stream()
                        .filter(item -> item.getBook().getId().equals(tempItem.getBook().getId()))
                        .findFirst()
                        .orElse(null);
                if (existingItem != null) {
                    existingItem.setQuantity(existingItem.getQuantity() + tempItem.getQuantity());
                } else {
                    CartItem newItem = new CartItem();
                    newItem.setBook(book);
                    newItem.setQuantity(tempItem.getQuantity());
                    newItem.setCart(cart);
                    cart.getCartItems().add(newItem);
                }
            } else {
                throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
            }
        }

        cartRepository.save(cart);
        clearTempCartCookie(response);
        return cartMapper.toUserCartDTO(cart);
    }

    // Xóa giỏ hàng khi đăng xuất và tạo giỏ hàng mới
    @Transactional
    public void logoutClearCart(HttpServletRequest request, HttpServletResponse response) {
        User user = getCurrentUser();
        if (user != null) {
            Cart cart = cartRepository.findByUserIdWithItems(user.getId())
                    .orElseThrow(() -> new RuntimeException("Cart not found for user id: " + user.getId()));
            cart.getCartItems().clear();
            cartRepository.save(cart);
        }
        clearTempCartCookie(response);
    }

    private Cart getOrCreateTempCart(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("cart_data".equals(cookie.getName())) {
                    try {
                        String decodedCartJson = new String(Base64.getDecoder().decode(cookie.getValue()));
                        TempCartDTO tempCartDTO = objectMapper.readValue(decodedCartJson, TempCartDTO.class);
                        Cart tempCart = new Cart();
                        if (tempCartDTO.getCartItems() != null) {
                            tempCart.setCartItems(tempCartDTO.getCartItems().stream()
                                    .map(item -> {
                                        CartItem cartItem = new CartItem();
                                        cartItem.setBook(bookRepository.findById(item.getBookId())
                                                .orElseThrow(() -> new RuntimeException("Book not found: " + item.getBookId())));
                                        cartItem.setQuantity(item.getQuantity());
                                        return cartItem;
                                    })
                                    .collect(Collectors.toCollection(ArrayList::new))); // Sử dụng ArrayList
                        } else {
                            tempCart.setCartItems(new ArrayList<>());
                        }
                        System.out.println("Loaded temp cart with items: " + tempCart.getCartItems().size()); // Debug
                        return tempCart;
                    } catch (Exception e) {
                        System.err.println("Error decoding cart cookie: " + e.getMessage()); // Debug
                        Cart tempCart = new Cart();
                        tempCart.setCartItems(new ArrayList<>());
                        return tempCart;
                    }
                }
            }
        }
        Cart tempCart = new Cart();
        tempCart.setCartItems(new ArrayList<>());
        updateCartCookie(tempCart, request, response);
        System.out.println("Created new empty temp cart"); // Debug
        return tempCart;
    }

    private void updateCartCookie(Cart cart, HttpServletRequest request, HttpServletResponse response) {
        try {
            UUID cartId = DEFAULT_TEMP_CART_ID;
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("cart_data".equals(cookie.getName())) {
                        try {
                            String decodedCartJson = new String(Base64.getDecoder().decode(cookie.getValue()));
                            TempCartDTO tempCartDTO = objectMapper.readValue(decodedCartJson, TempCartDTO.class);
                            if (tempCartDTO.getId() != null) {
                                cartId = tempCartDTO.getId();
                            }
                            break;
                        } catch (Exception e) {
                            System.err.println("Error reading cart ID from cookie: " + e.getMessage()); // Debug
                        }
                    }
                }
            }

            TempCartDTO tempCartDTO = new TempCartDTO();
            tempCartDTO.setId(cartId);
            tempCartDTO.setCartItems(cart.getCartItems().stream().map(item -> {
                TempCartDTO.CartItemDTO dto = new TempCartDTO.CartItemDTO();
                dto.setBookId(item.getBook().getId());
                dto.setQuantity(item.getQuantity());
                return dto;
            }).toList());

            String cartJson = objectMapper.writeValueAsString(tempCartDTO);
            String encodedCartJson = Base64.getEncoder().encodeToString(cartJson.getBytes());
            Cookie cookie = new Cookie("cart_data", encodedCartJson);
            cookie.setMaxAge(7 * 24 * 60 * 60); // 7 ngày
            cookie.setPath("/");
            response.addCookie(cookie);
            System.out.println("Updated cart cookie with items: " + cart.getCartItems().size()); // Debug
        } catch (JsonProcessingException e) {
            System.err.println("Failed to serialize cart to cookie: " + e.getMessage()); // Debug
            throw new RuntimeException("Failed to serialize cart to cookie", e);
        }
    }

    private void clearTempCartCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("cart_data", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}