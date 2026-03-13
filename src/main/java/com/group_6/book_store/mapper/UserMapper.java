package com.group_6.book_store.mapper;

import com.group_6.book_store.dto.UserDTO;
import com.group_6.book_store.entity.User;
import com.group_6.book_store.form.UserRegisterForm;
import com.group_6.book_store.form.UserUpdateForm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    @Mapping(target = "role", source = "role", qualifiedByName = "roleToString")
    UserDTO toDTO(User user);

    User toEntity(UserRegisterForm form);

    void updateEntityFromForm(UserUpdateForm form, @MappingTarget User user);

    @org.mapstruct.Named("roleToString")
    default String roleToString(User.Role role) {
        return role != null ? role.name() : null;
    }
}