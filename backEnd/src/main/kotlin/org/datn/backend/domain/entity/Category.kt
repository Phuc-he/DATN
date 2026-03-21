package org.datn.backend.domain.entity

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "categories")
data class Category(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val name: String,
    val description: String? = null,
    @Lob
    @Column(name = "image", columnDefinition = "LONGTEXT")
    val image: String? = null,
    @CreationTimestamp
    val createdAt: LocalDateTime? = null,
)