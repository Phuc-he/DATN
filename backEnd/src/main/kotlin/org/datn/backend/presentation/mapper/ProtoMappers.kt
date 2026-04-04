package org.datn.backend.presentation.mapper

import org.datn.backend.domain.entity.ActivityLog
import org.datn.backend.domain.entity.Author
import org.datn.backend.domain.entity.Book
import org.datn.backend.domain.entity.Category
import org.datn.backend.domain.entity.Message
import org.datn.backend.domain.entity.MessageSender
import org.datn.backend.domain.entity.Order
import org.datn.backend.domain.entity.OrderItem
import org.datn.backend.domain.entity.QrPaymentResponse
import org.datn.backend.domain.entity.User
import org.datn.backend.domain.entity.Voucher
import org.datn.backend.domain.entity.WebSetting
import org.datn.backend.proto.ActivityLogPageResponse
import org.datn.backend.proto.ActivityLogProto
import org.datn.backend.proto.AuthorPageResponse
import org.datn.backend.proto.AuthorProto
import org.datn.backend.proto.BookPageResponse
import org.datn.backend.proto.BookProto
import org.datn.backend.proto.CategoryPageResponse
import org.datn.backend.proto.CategoryProto
import org.datn.backend.proto.DiscountTypeProto
import org.datn.backend.proto.MessageResponsePageResponse
import org.datn.backend.proto.MessageResponseProto
import org.datn.backend.proto.MessageSenderProto
import org.datn.backend.proto.OrderItemProto
import org.datn.backend.proto.OrderPageResponse
import org.datn.backend.proto.OrderProto
import org.datn.backend.proto.OrderStatus
import org.datn.backend.proto.QrPaymentResponseProto
import org.datn.backend.proto.Role
import org.datn.backend.proto.UserPageResponse
import org.datn.backend.proto.UserProto
import org.datn.backend.proto.VoucherPageResponse
import org.datn.backend.proto.VoucherProto
import org.datn.backend.proto.WebSettingPageResponse
import org.datn.backend.proto.WebSettingProto
import org.springframework.data.domain.Page
import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

private val dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME

fun Author.toProto(): AuthorProto = AuthorProto.newBuilder()
        .setId(id ?: 0L)
        .setName(name)
        .setBio(bio ?: "")
        .setProfileImage(profileImage ?: "")
        .build()

fun Page<Author>.toPageResponse(): AuthorPageResponse = AuthorPageResponse.newBuilder()
    .addAllContent(content.map { it.toProto() })
    .setTotalElements(totalElements)
    .setTotalPages(totalPages)
    .setPageNumber(number)
    .setPageSize(size)
    .build()

fun Book.toProto(): BookProto {
    val builder = BookProto.newBuilder()
        .setId(id ?: 0L)
        .setTitle(title)
        .setDescription(description ?: "")
        .setPrice(price.toString())
        .setStock(stock)
        .setDiscount(discount.toString())
        .setImageUrl(imageUrl ?: "")
        .setCreatedAt(createdAt?.format(dateFormatter) ?: "")
        .setIsNotable(isNotable)

    author?.let {
        builder.setAuthor(AuthorProto.newBuilder().setId(it.id ?: 0L).setName(it.name).build())
    }
    category?.let {
        builder.setCategory(CategoryProto.newBuilder().setId(it.id ?: 0L).setName(it.name).build())
    }

    return builder.build()
}

fun Page<Book>.toPageResponse(): BookPageResponse = BookPageResponse.newBuilder()
    .addAllContent(content.map { it.toProto() })
    .setTotalElements(totalElements)
    .setTotalPages(totalPages)
    .setPageNumber(number)
    .setPageSize(size)
    .build()

fun Category.toProto(): CategoryProto {
    return CategoryProto.newBuilder()
        .setId(id ?: 0L)
        .setName(name)
        .setDescription(description ?: "")
        .setCreatedAt(createdAt?.format(dateFormatter) ?: "")
        .setImage(image ?: "")
        .build()
}

fun Page<Category>.toPageResponse(): CategoryPageResponse = CategoryPageResponse.newBuilder()
    .addAllContent(content.map { it.toProto() })
    .setTotalElements(totalElements)
    .setTotalPages(totalPages)
    .setPageNumber(number)
    .setPageSize(size)
    .build()

fun Order.toProto(): OrderProto {
    val builder = OrderProto.newBuilder()
        .setId(id ?: 0L)
        .setFullName(fullName)
        .setPhone(phone)
        .setAddress(address)
        .setCartId(cartId ?: "")
        .setTotalAmount(totalAmount.toString())
        .setStatus(OrderStatus.valueOf(status.name))
        .setCreatedAt(createdAt?.format(dateFormatter) ?: "")

    // Map User
    builder.setUser(UserProto.newBuilder().setId(user.id ?: 0L).setUsername(user.username).build())

    // Map Items (Nested List)
    items.forEach { item ->
        val itemProto = OrderItemProto.newBuilder()
            .setId(item.id ?: 0L)
            .setQuantity(item.quantity)
            .setUnitPrice(item.unitPrice.toString())
            .setDiscount(item.discount.toString())
            .setBook(item.book.toProto())
            .build()
        builder.addItems(itemProto)
    }

    return builder.build()
}

fun Page<Order>.toPageResponse(): OrderPageResponse = OrderPageResponse.newBuilder()
    .addAllContent(content.map { it.toProto() })
    .setTotalElements(totalElements)
    .setTotalPages(totalPages)
    .setPageNumber(number)
    .setPageSize(size)
    .build()

fun OrderItem.toProto(): OrderItemProto = OrderItemProto.newBuilder()
    .setId(id ?: 0L)
    .setBook(book.toProto())
    .setQuantity(quantity)
    .setUnitPrice(unitPrice.toString())
    .setDiscount(discount.toString())
    .build()

fun QrPaymentResponse.toProto(): QrPaymentResponseProto = QrPaymentResponseProto.newBuilder()
    .setQrUrl(qrUrl)
    .setAmount(amount)
    .setOrderId(orderId)
    .setDescription(description)
    .build()

// --- Mapper Extension ---
fun User.toProto(): UserProto {
    // Map the Domain Role to the Proto Role
    val protoRole = when (role) {
        org.datn.backend.domain.entity.Role.ADMIN -> Role.ADMIN
        org.datn.backend.domain.entity.Role.CUSTOMER -> Role.CUSTOMER
        org.datn.backend.domain.entity.Role.AUTHOR -> Role.AUTHOR_ROLE
    }

    return UserProto.newBuilder()
        .setId(id ?: 0L)
        .setUsername(username)
        .setEmail(email)
        .setFullName(fullName ?: "")
        .setAddress(address ?: "")
        .setPhone(phone ?: "")
        .setRole(protoRole) // Pass the mapped enum directly
        .setAvatar(avatar ?: "")
        .setCreatedAt(createdAt?.format(dateFormatter) ?: "")
        .build()
}

fun MessageSender.toProto(): MessageSenderProto = when (this) {
    MessageSender.USER -> MessageSenderProto.USER
    MessageSender.AI -> MessageSenderProto.AI
}

fun Message.toProto(): MessageResponseProto = MessageResponseProto.newBuilder()
    .setId(id ?: 0L)
    .setUser(user?.toProto())
    .setSender(sender.toProto())
    .setContent(content)
    .setRelatedBook(relatedBook?.toProto() ?: Book(title = "", price = BigDecimal.ZERO).toProto())
    .setCreatedAt(createdAt?.format(dateFormatter) ?: "")
    .build()

fun UserProto.toEntity(): User {
    val entityRole = when (role) {
        Role.ADMIN -> org.datn.backend.domain.entity.Role.ADMIN
        Role.CUSTOMER -> org.datn.backend.domain.entity.Role.CUSTOMER
        Role.AUTHOR_ROLE -> org.datn.backend.domain.entity.Role.AUTHOR
        else -> org.datn.backend.domain.entity.Role.CUSTOMER
    }

    return User(
        username = this.username,
        email = this.email,
        password = "", // Service sẽ đảm nhận việc mã hóa password
        fullName = this.fullName,
        address = this.address,
        phone = this.phone,
        role = entityRole,
        avatar = this.avatar
    )
}

fun BookProto.toEntity(): Book {
    return Book(
        id = if (this.id != 0L) this.id else null, // Handle ID if present
        title = this.title,
        description = this.description,
        price = if (this.price.isNotEmpty()) BigDecimal(this.price) else BigDecimal.ZERO,
        stock = this.stock,
        discount = if (this.discount.isNotEmpty()) BigDecimal(this.discount) else BigDecimal.ZERO,
        imageUrl = this.imageUrl,
        // Mapping Relations via Stubs
        author = if (this.hasAuthor()) Author(id = this.author.id, name = "") else null,
        category = if (this.hasCategory()) Category(id = this.category.id, name = "") else null,
        isNotable = this.isNotable,
        createdAt = if (createdAt.isNotBlank()) {
            try {
                LocalDateTime.parse(createdAt)
            } catch (e: Exception) {
                LocalDateTime.now() // Fallback nếu chuỗi string lỗi định dạng
            }
        } else {
            LocalDateTime.now()
        },
    )
}

fun Page<Message>.toPageResponse(): MessageResponsePageResponse = MessageResponsePageResponse.newBuilder()
    .addAllContent(content.map { it.toProto() })
    .setTotalElements(totalElements)
    .setTotalPages(totalPages)
    .setPageNumber(number)
    .setPageSize(size)
    .build()

fun Page<User>.toPageResponse(): UserPageResponse = UserPageResponse.newBuilder()
    .addAllContent(content.map { it.toProto() })
    .setTotalElements(totalElements)
    .setTotalPages(totalPages)
    .setPageNumber(number)
    .setPageSize(size)
    .build()

fun Voucher.toProto(): VoucherProto {
    return VoucherProto.newBuilder()
        .setId(id ?: 0L)
        .setCode(code)
        .setDiscountType(DiscountTypeProto.valueOf(discountType.name))
        .setDiscountValue(discountValue)
        .setMinOrderValue(minOrderValue ?: 0.0)
        .setMaxUses(maxUses)
        .setUsedCount(usedCount)
        .setStartDate(startDate.toString())
        .setExpirationDate(expirationDate.toString())
        .setIsActive(isActive)
        .build()
}

fun Page<Voucher>.toPageResponse(): VoucherPageResponse = VoucherPageResponse.newBuilder()
        .addAllContent(content.map { it.toProto() })
        .setTotalPages(totalPages)
        .setTotalElements(totalElements)
        .build()

fun WebSetting.toProto(): WebSettingProto = WebSettingProto.newBuilder()
        .setId(id ?: 0L)
        .setWebName(webName)
        .setLogoUrl(logoUrl ?: "")
        .setHeaderIcon(headerIcon ?: "BookOpen")
        .setContactEmail(contactEmail ?: "")
        .setFooterText(footerText ?: "")
        .setIsActive(isActive)
        .setUpdatedAt(updatedAt?.toString() ?: "")
        .build()

fun Page<WebSetting>.toPageResponse() : WebSettingPageResponse = WebSettingPageResponse.newBuilder()
        .addAllContent(content.map { it.toProto() })
        .setTotalPages(totalPages)
        .setTotalElements(totalElements)
        .build()

fun ActivityLog.toProto(): ActivityLogProto = ActivityLogProto.newBuilder()
    .setId(id ?: 0L)
    .setAction(action)
    .setEntityName(entityName)
    .setDetails(details)
    .setCreatedAt(createdAt?.toString() ?: "")
    .setPerformedBy(performedBy ?: "")
    .build()

fun Page<ActivityLog>.toPageResponse() : ActivityLogPageResponse = ActivityLogPageResponse.newBuilder()
    .addAllContent(content.map { it.toProto() })
    .setTotalPages(totalPages)
    .setTotalElements(totalElements)
    .build()