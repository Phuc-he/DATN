package org.datn.backend.domain.entity

import jakarta.persistence.*
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "web_settings")
data class WebSetting(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @Column(name = "web_name", nullable = false)
    var webName: String,
    @Column(name = "logo_url", columnDefinition = "LONGTEXT")
    @Lob
    var logoUrl: String? = null,
    @Column(name = "header_icon")
    var headerIcon: String? = "BookOpen",
    @Column(name = "contact_email")
    var contactEmail: String? = null,
    @Column(name = "footer_text", columnDefinition = "TEXT")
    var footerText: String? = null,
    @Column(name = "is_active", nullable = false)
    var isActive: Boolean = true,
    @UpdateTimestamp
    @Column(name = "updated_at")
    var updatedAt: LocalDateTime? = null,
)
