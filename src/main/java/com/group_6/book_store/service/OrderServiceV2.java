package com.group_6.book_store.service;

import com.group_6.book_store.dto.OrderDTO;
import com.group_6.book_store.dto.OrderDTO_v2;
import com.group_6.book_store.entity.Book;
import com.group_6.book_store.entity.Order;
import com.group_6.book_store.entity.OrderItem;
import com.group_6.book_store.entity.User;
import com.group_6.book_store.form.OrderCreateForm;
import com.group_6.book_store.form.OrderItemForm;
import com.group_6.book_store.form.OrderStatusUpdateForm;
import com.group_6.book_store.mapper.OrderMapper;
import com.group_6.book_store.repository.BookRepository;
import com.group_6.book_store.repository.OrderRepository;
import com.group_6.book_store.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceV2 {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderMapper orderMapper;

    public OrderServiceV2(OrderRepository orderRepository, UserRepository userRepository,
                          BookRepository bookRepository, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.orderMapper = orderMapper;
    }

    public Page<OrderDTO> getOrdersByUserId(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable)
                .map(orderMapper::toDTO);
    }

    @Transactional
    public OrderDTO createOrder(Long userId, OrderCreateForm form) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.UNPROCESSED);
        order.setFullName(form.getFullName());
        order.setPhone(form.getPhone());
        order.setAddress(form.getAddress());
        order.setCartId(form.getCartId()); // Thêm ánh xạ cartId

        // Kiểm tra số lượng đơn hàng hiện tại để xác định itemSequence
        long existingOrderCount = orderRepository.countByUserId(userId);
        int itemSequenceStart = (existingOrderCount == 0) ? 1 : 1; // Bắt đầu từ 1 cho mỗi đơn hàng mới

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        int itemSequence = itemSequenceStart;

        for (OrderItemForm itemForm : form.getOrderItems()) {
            Book book = bookRepository.findById(itemForm.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found with id: " + itemForm.getBookId()));

            if (book.getStock() < itemForm.getQuantity()) {
                throw new RuntimeException("Insufficient stock for book: " + book.getTitle());
            }

            // Kiểm tra giá unitPrice khớp với giá sách
            if (book.getPrice().compareTo(itemForm.getUnitPrice()) != 0) {
                throw new RuntimeException("Unit price does not match book price for: " + book.getTitle());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setBook(book);
            orderItem.setQuantity(itemForm.getQuantity());
            orderItem.setUnitPrice(itemForm.getUnitPrice());
            orderItem.setDiscount(book.getDiscount());
            orderItem.setItemSequence(itemSequence++);

            // Tính discount và tổng tiền
            BigDecimal discountAmount = orderItem.getUnitPrice()
                    .multiply(orderItem.getDiscount().divide(new BigDecimal("100"), 2, BigDecimal.ROUND_HALF_UP));
            BigDecimal discountedPrice = orderItem.getUnitPrice().subtract(discountAmount);
            totalAmount = totalAmount.add(discountedPrice.multiply(new BigDecimal(itemForm.getQuantity())));

            orderItems.add(orderItem);

            // Cập nhật stock
            book.setStock(book.getStock() - itemForm.getQuantity());
            bookRepository.save(book);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        return orderMapper.toDTO(order);
    }

    // Phương thức mới: Lấy tất cả đơn hàng
    public Page<OrderDTO_v2> getAllOrders(Pageable pageable) {
        // Sử dụng phương thức tối ưu hóa JOIN FETCH từ Repository
        return orderRepository.findAllWithDetails(pageable)
                .map(this::convertToOrderDTOV2); // Sửa mapper call
    }

    // Phương thức hỗ trợ mới để chuyển đổi Entity sang DTO_v2
    private OrderDTO_v2 convertToOrderDTOV2(Order order) {
        OrderDTO_v2 dtoV2 = orderMapper.toDTO_V2(order);

        // Tính toán tổng số lượng sản phẩm (totalQuantity)
        int totalQuantity = order.getOrderItems().stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();

        dtoV2.setTotalQuantity(totalQuantity);

        return dtoV2;
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findByIdWithDetails(orderId); // Sử dụng findByIdWithDetails để load OrderItems và Book

        if (order == null) {
            throw new RuntimeException("Order not found with id: " + orderId);
        }

        // 1. Hoàn trả lại Stock (Tồn kho) cho các cuốn sách
        for (OrderItem item : order.getOrderItems()) {
            Book book = item.getBook();
            // Cập nhật stock: stock mới = stock cũ + số lượng đã mua
            book.setStock(book.getStock() + item.getQuantity());
            bookRepository.save(book);
        }

        // 2. Xóa đơn hàng
        // CascadeType.ALL và orphanRemoval=true trong Order Items sẽ đảm bảo OrderItems cũng bị xóa.
        orderRepository.delete(order);
    }

    @Transactional
    public OrderDTO_v2 updateOrderStatus(Long orderId, OrderStatusUpdateForm form) {
        // 1. Tìm đơn hàng. Sử dụng findById cơ bản vì không cần JOIN FETCH OrderItems.
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // 2. Cập nhật trạng thái bằng Mapper.
        // MapStruct chỉ ánh xạ trường 'status' từ Form sang Entity nhờ phương thức updateStatusFromForm
        orderMapper.updateStatusFromForm(form, order);

        // Cập nhật trường updatedAt tự động nhờ @PreUpdate trong Entity Order

        // 3. Lưu đơn hàng đã cập nhật
        Order updatedOrder = orderRepository.save(order);

        // 4. Chuyển đổi sang DTO và trả về (sử dụng convertToOrderDTOV2 có sẵn)
        return convertToOrderDTOV2(updatedOrder);
    }
}