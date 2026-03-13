//package com.group_6.book_store.service;
//
//import com.group_6.book_store.dto.OrderDTO;
//import com.group_6.book_store.entity.*;
//import com.group_6.book_store.form.OrderCreateForm;
//import com.group_6.book_store.form.OrderItemForm;
//import com.group_6.book_store.form.OrderStatusUpdateForm;
//import com.group_6.book_store.mapper.OrderMapper;
//import com.group_6.book_store.repository.BookRepository;
//import com.group_6.book_store.repository.CartRepository;
//import com.group_6.book_store.repository.OrderRepository;
//import com.group_6.book_store.repository.UserRepository;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.security.access.AccessDeniedException;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class OrderService {
//
//    private final OrderRepository orderRepository;
//    private final UserRepository userRepository;
//    private final BookRepository bookRepository;
//    private final CartRepository cartRepository;
//    private final OrderMapper orderMapper;
//
//    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
//                        BookRepository bookRepository, CartRepository cartRepository,
//                        OrderMapper orderMapper) {
//        this.orderRepository = orderRepository;
//        this.userRepository = userRepository;
//        this.bookRepository = bookRepository;
//        this.cartRepository = cartRepository;
//        this.orderMapper = orderMapper;
//    }
//
//    public Page<OrderDTO> getAllOrders(Pageable pageable) {
//        if (!hasRole("ADMIN")) {
//            throw new AccessDeniedException("Only ADMIN can view all orders");
//        }
//        return orderRepository.findAllWithDetails(pageable)
//                .map(orderMapper::toDTO);
//    }
//
//    public Page<OrderDTO> getMyOrders(Pageable pageable) {
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found: " + username));
//        return orderRepository.findByUserIdWithDetails(user.getId(), pageable)
//                .map(orderMapper::toDTO);
//    }
//
//    public OrderDTO getOrder(Long id) {
//        Order order = orderRepository.findByIdWithDetails(id);
//        if (order == null) {
//            throw new RuntimeException("Order not found with id: " + id);
//        }
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        if (!hasRole("ADMIN") && !order.getUser().getUsername().equals(username)) {
//            throw new AccessDeniedException("You can only view your own orders");
//        }
//        return orderMapper.toDTO(order);
//    }
//
//    @Transactional
//    public OrderDTO createOrder(OrderCreateForm form) {
//        if (!hasRole("CUSTOMER")) {
//            throw new AccessDeniedException("Only CUSTOMER can create orders");
//        }
//
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found: " + username));
//
//        Order order = orderMapper.toEntity(form);
//        order.setUser(user);
//        order.setStatus(Order.OrderStatus.PENDING);
//
//        List<OrderItem> orderItems = new ArrayList<>();
//        for (OrderItemForm itemForm : form.getOrderItems()) {
//            Book book = bookRepository.findById(itemForm.getBookId())
//                    .orElseThrow(() -> new RuntimeException("Book not found with id: " + itemForm.getBookId()));
//            if (book.getStock() < itemForm.getQuantity()) {
//                throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
//            }
//            if (book.getPrice().compareTo(itemForm.getUnitPrice()) != 0) {
//                throw new RuntimeException("Unit price does not match book price for: " + book.getTitle());
//            }
//            OrderItem orderItem = orderMapper.toOrderItemEntity(itemForm);
//            orderItem.setOrder(order);
//            orderItem.setBook(book);
//            orderItems.add(orderItem);
//            book.setStock(book.getStock() - itemForm.getQuantity());
//            bookRepository.save(book);
//        }
//        order.setOrderItems(orderItems);
//        order = orderRepository.save(order);
//        return orderMapper.toDTO(order);
//    }
//
//    @Transactional
//    public OrderDTO createOrderFromCart(String shippingAddress) {
//        if (!hasRole("CUSTOMER")) {
//            throw new AccessDeniedException("Only CUSTOMER can create orders");
//        }
//
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found: " + username));
//
//        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
//                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + username));
//
//        if (cart.getCartItems().isEmpty()) {
//            throw new RuntimeException("Cart is empty");
//        }
//
//        Order order = new Order();
//        order.setUser(user);
//        order.setStatus(Order.OrderStatus.PENDING);
//        order.setShippingAddress(shippingAddress);
//
//        List<OrderItem> orderItems = new ArrayList<>();
//        BigDecimal totalAmount = BigDecimal.ZERO;
//
//        for (CartItem cartItem : cart.getCartItems()) {
//            Book book = cartItem.getBook();
//            if (book.getStock() < cartItem.getQuantity()) {
//                throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
//            }
//            OrderItem orderItem = new OrderItem();
//            orderItem.setOrder(order);
//            orderItem.setBook(book);
//            orderItem.setQuantity(cartItem.getQuantity());
//            orderItem.setUnitPrice(book.getPrice());
//            orderItems.add(orderItem);
//            totalAmount = totalAmount.add(book.getPrice().multiply(new BigDecimal(cartItem.getQuantity())));
//            book.setStock(book.getStock() - cartItem.getQuantity());
//            bookRepository.save(book);
//        }
//
//        order.setOrderItems(orderItems);
//        order.setTotalAmount(totalAmount);
//        order = orderRepository.save(order);
//
//        // Clear cart after order creation
//        cart.getCartItems().clear();
//        cartRepository.save(cart);
//
//        return orderMapper.toDTO(order);
//    }
//
//    public OrderDTO updateOrderStatus(Long id, OrderStatusUpdateForm form) {
//        if (!hasRole("ADMIN")) {
//            throw new AccessDeniedException("Only ADMIN can update order status");
//        }
//
//        Order order = orderRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
//        orderMapper.updateStatusFromForm(form, order);
//        order = orderRepository.save(order);
//        return orderMapper.toDTO(order);
//    }
//
//    public void deleteOrder(Long id) {
//        if (!hasRole("ADMIN")) {
//            throw new AccessDeniedException("Only ADMIN can delete orders");
//        }
//
//        if (!orderRepository.existsById(id)) {
//            throw new RuntimeException("Order not found with id: " + id);
//        }
//        orderRepository.deleteById(id);
//    }
//
//    private boolean hasRole(String role) {
//        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
//                .stream()
//                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role));
//    }
//}