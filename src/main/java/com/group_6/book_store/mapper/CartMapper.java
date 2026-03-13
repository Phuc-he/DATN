package com.group_6.book_store.mapper;

import com.group_6.book_store.dto.TempCartDTO;
import com.group_6.book_store.dto.UserCartDTO;
import com.group_6.book_store.entity.Cart;
import com.group_6.book_store.entity.CartItem;
import com.group_6.book_store.entity.User;
import com.group_6.book_store.form.CartItemCreateForm;
import com.group_6.book_store.form.CartItemUpdateForm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(target = "userId", source = "cart.user.id")
    @Mapping(target = "cartItems", source = "cart.cartItems")
    UserCartDTO toUserCartDTO(Cart cart);

    @Mapping(target = "id", expression = "java(java.util.UUID.randomUUID())") // Loại bỏ toString()
    @Mapping(target = "cartItems", source = "cartItems")
    TempCartDTO toTempCartDTO(Cart cart);

    @Mapping(target = "book", ignore = true)
    @Mapping(target = "cart", ignore = true)
    CartItem toCartItemEntity(CartItemCreateForm form);

    @Mapping(target = "book", ignore = true)
    @Mapping(target = "cart", ignore = true)
    void updateCartItemFromForm(CartItemUpdateForm form, @MappingTarget CartItem cartItem);

    default UserCartDTO.CartItemDTO toUserCartItemDTO(CartItem item) {
        if (item == null) return null;
        UserCartDTO.CartItemDTO dto = new UserCartDTO.CartItemDTO();
        dto.setBookId(item.getBook().getId());
        dto.setQuantity(item.getQuantity());
        return dto;
    }

    default TempCartDTO.CartItemDTO toTempCartItemDTO(CartItem item) {
        if (item == null) return null;
        TempCartDTO.CartItemDTO dto = new TempCartDTO.CartItemDTO();
        dto.setBookId(item.getBook().getId());
        dto.setQuantity(item.getQuantity());
        return dto;
    }

    default List<UserCartDTO.CartItemDTO> toUserCartItemDTOs(List<CartItem> items) {
        if (items == null) return null;
        return items.stream().map(this::toUserCartItemDTO).toList();
    }

    default List<TempCartDTO.CartItemDTO> toTempCartItemDTOs(List<CartItem> items) {
        if (items == null) return null;
        return items.stream().map(this::toTempCartItemDTO).toList();
    }
}