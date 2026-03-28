package org.datn.backend.domain.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "activity_logs")
data class ActivityLog(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val action: String, // e.g., "CREATE", "UPDATE", "DELETE"
    val entityName: String, // e.g., "Book", "Author"
    val details: String, // e.g., "Updated book 'The Great Gatsby'"

    @Column(name = "performed_by")
    val performedBy: String? = "Admin",

    @CreationTimestamp
    val createdAt: LocalDateTime? = null
)