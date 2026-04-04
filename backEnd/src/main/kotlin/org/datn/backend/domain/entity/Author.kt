package org.datn.backend.domain.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Lob
import jakarta.persistence.Table


@Entity
@Table(name = "authors")
data class Author(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val name: String,
    val bio: String? = null,
    @Lob
    @Column(name = "profile_image", columnDefinition = "LONGTEXT")
    val profileImage: String? = null,
)
