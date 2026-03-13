package com.group_6.book_store.mapper;

import com.group_6.book_store.dto.OrderDTO;
import com.group_6.book_store.dto.OrderDTO_v2;
import com.group_6.book_store.dto.OrderItemDTO;
import com.group_6.book_store.entity.Order;
import com.group_6.book_store.entity.OrderItem;
import com.group_6.book_store.form.OrderCreateForm;
import com.group_6.book_store.form.OrderItemForm;
import com.group_6.book_store.form.OrderStatusUpdateForm;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OrderMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "fullName", target = "userInfo.fullName")
    @Mapping(source = "phone", target = "userInfo.phone")
    @Mapping(source = "address", target = "userInfo.address")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "orderItems", target = "orderItems")
    OrderDTO toDTO(Order order);

    @Mapping(target = "orderItems", ignore = true)
    Order toEntity(OrderCreateForm form);

    @Mapping(source = "itemSequence", target = "id") // Ánh xạ itemSequence vào id
    @Mapping(source = "book.id", target = "bookId")
    @Mapping(source = "book.title", target = "bookTitle")
    @Mapping(source = "discount", target = "discount")
    OrderItemDTO toOrderItemDTO(OrderItem orderItem);

    OrderItem toOrderItemEntity(OrderItemForm form);

    @Mapping(target = "status", source = "status")
    void updateStatusFromForm(OrderStatusUpdateForm form, @MappingTarget Order order);

    // Phương thức mới để ánh xạ sang DTO_v2
    @Mapping(source = "user.username", target = "userName")
    @Mapping(source = "fullName", target = "userInfo.fullName")
    @Mapping(source = "phone", target = "userInfo.phone")
    @Mapping(source = "address", target = "userInfo.address")
    // totalQuantity phải được tính toán trong Service vì nó là aggregated field
    @Mapping(target = "totalQuantity", ignore = true)
    OrderDTO_v2 toDTO_V2(Order order);
}