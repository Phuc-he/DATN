package com.group_6.book_store.repository;

import com.group_6.book_store.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Lấy tất cả các đơn hàng cùng với thông tin user, orderItems và book
     * Sử dụng JOIN FETCH thay vì LEFT JOIN FETCH để tối ưu hóa khi chắc chắn mối quan hệ luôn tồn tại
     */
    @Query("SELECT o FROM Order o JOIN FETCH o.user JOIN FETCH o.orderItems oi JOIN FETCH oi.book")
    Page<Order> findAllWithDetails(Pageable pageable);

    /**
     * Lấy danh sách đơn hàng của một userId cụ thể cùng với thông tin user, orderItems và book
     */
    @Query("SELECT o FROM Order o JOIN FETCH o.user JOIN FETCH o.orderItems oi JOIN FETCH oi.book WHERE o.user.id = :userId")
    Page<Order> findByUserIdWithDetails(@Param("userId") Long userId, Pageable pageable);

    /**
     * Lấy thông tin chi tiết của một đơn hàng dựa trên id
     */
    @Query("SELECT o FROM Order o JOIN FETCH o.user JOIN FETCH o.orderItems oi JOIN FETCH oi.book WHERE o.id = :id")
    Order findByIdWithDetails(@Param("id") Long id);

    /**
     * Đếm số lượng đơn hàng của một userId
     */
    long countByUserId(Long userId);
    Page<Order> findByUserId(Long userId, Pageable pageable);
}