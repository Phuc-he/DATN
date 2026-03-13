package com.group_6.book_store.mapper;

import com.group_6.book_store.dto.BookDTO;
import com.group_6.book_store.entity.Book;
import com.group_6.book_store.form.BookCreateForm;
import com.group_6.book_store.form.BookUpdateForm;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookMapper {
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "author.id", target = "authorId")
    @Mapping(source = "author.name", target = "authorName")
    @Mapping(source = "discount", target = "discount") // Ánh xạ discount
    BookDTO toDTO(Book book);

    @Mapping(target = "discount", source = "discount") // Ánh xạ discount từ form
    Book toEntity(BookCreateForm form);

    // Chỉ cập nhật các trường được gửi trong form, các trường khác giữ nguyên
    @Mapping(target = "discount", source = "discount") // Ánh xạ discount
    void updateEntityFromForm(BookUpdateForm form, @MappingTarget Book book);
}