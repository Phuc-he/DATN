package org.datn.backend.domain.entity

enum class UserHistoryStatus(val displayName: String) {
    /** Khách mới / chưa có lịch sử */
    NEW_USER("Khách mới"),

    /** Khách có lịch sử tốt */
    GOOD_HISTORY("Lịch sử tốt"),

    /** Khách từng boom hàng */
    BOOM_HISTORY("Từng boom hàng")
}
