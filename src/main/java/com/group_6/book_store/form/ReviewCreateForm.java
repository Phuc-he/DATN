package com.group_6.book_store.form;

import jakarta.validation.constraints.*;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ReviewCreateForm {
    @NotNull(message = "ID sách không được để trống")
    private Long bookId;

    @NotNull(message = "ID người dùng không được để trống")
    private Long userId;

    @NotNull(message = "Điểm đánh giá không được để trống")
    @Min(value = 1, message = "Điểm đánh giá phải từ 1 đến 5")
    @Max(value = 5, message = "Điểm đánh giá phải từ 1 đến 5")
    private Integer rating;

    private String comment;
}