package com.group_6.book_store.mapper;

import com.group_6.book_store.dto.AuthorPostDTO;
import com.group_6.book_store.entity.AuthorPost;
import com.group_6.book_store.form.AuthorPostCreateForm;
import com.group_6.book_store.form.AuthorPostUpdateForm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AuthorPostMapper {
    @Mapping(source = "author.id", target = "authorId")
    @Mapping(source = "author.name", target = "authorName")
    AuthorPostDTO toDTO(AuthorPost authorPost);

    AuthorPost toEntity(AuthorPostCreateForm form);

    void updateEntityFromForm(AuthorPostUpdateForm form, @MappingTarget AuthorPost authorPost);
}