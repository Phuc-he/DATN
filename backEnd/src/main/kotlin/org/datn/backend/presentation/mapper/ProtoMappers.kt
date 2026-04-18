package org.datn.backend.presentation.mapper

import org.datn.backend.domain.entity.ActivityLog
import org.datn.backend.domain.entity.Author
import org.datn.backend.domain.entity.Book
import org.datn.backend.domain.entity.BookType
import org.datn.backend.domain.entity.Category
import org.datn.backend.domain.entity.Message
import org.datn.backend.domain.entity.MessageSender
import org.datn.backend.domain.entity.Order
import org.datn.backend.domain.entity.OrderItem
import org.datn.backend.domain.entity.QrPaymentResponse
import org.datn.backend.domain.entity.User
import org.datn.backend.domain.entity.UserHistoryStatus
import org.datn.backend.domain.entity.Voucher
import org.datn.backend.domain.entity.WebSetting
import org.datn.backend.proto.ActivityLogPageResponse
import org.datn.backend.proto.ActivityLogProto
import org.datn.backend.proto.AuthorPageResponse
import org.datn.backend.proto.AuthorProto
import org.datn.backend.proto.BookPageResponse
import org.datn.backend.proto.BookProto
import org.datn.backend.proto.BookTypeProto
import org.datn.backend.proto.CategoryPageResponse
import org.datn.backend.proto.CategoryProto
import org.datn.backend.proto.DiscountTypeProto
import org.datn.backend.proto.MessageResponsePageResponse
import org.datn.backend.proto.MessageResponseProto
import org.datn.backend.proto.MessageSenderProto
import org.datn.backend.proto.OrderItemProto
import org.datn.backend.proto.OrderPageResponse
import org.datn.backend.proto.OrderProto
import org.datn.backend.proto.QrPaymentResponseProto
import org.datn.backend.proto.Role
import org.datn.backend.proto.UserHistoryStatusProto
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

// --- Author ---
fun Author.toProto(): AuthorProto =
    AuthorProto
        .newBuilder()
        .setId(id ?: 0L)
        .setName(name)
        .setBio(bio ?: "")
        .setProfileImage(profileImage ?: "")
        .build()

fun Page<Author>.toPageResponse(): AuthorPageResponse =
    AuthorPageResponse
        .newBuilder()
        .addAllContent(content.map { it.toProto() })
        .setTotalElements(totalElements)
        .setTotalPages(totalPages)
        .setPageNumber(number)
        .setPageSize(size)
        .build()

// --- Book ---
fun BookType?.toProto(): BookTypeProto = when (this) {
    BookType.HOT -> BookTypeProto.HOT
    BookType.LIMITED -> BookTypeProto.LIMITED
    BookType.PRE_ORDER -> BookTypeProto.PRE_ORDER
    else -> BookTypeProto.NORMAL
}

fun BookTypeProto?.toEntity(): BookType = when(this) {
    BookTypeProto.HOT -> BookType.HOT
    BookTypeProto.LIMITED -> BookType.LIMITED
    BookTypeProto.PRE_ORDER -> BookType.PRE_ORDER
    else -> BookType.NORMAL
}

fun Book.toProto(): BookProto {
    val builder =
        BookProto
            .newBuilder()
            .setId(id ?: 0L)
            .setTitle(title)
            .setDescription(description ?: "")
            .setPrice(price.toString())
            .setStock(stock)
            .setDiscount(discount.toString())
            .setImageUrl(imageUrl ?: "")
            .setCreatedAt(createdAt?.format(dateFormatter) ?: "")
            .setIsNotable(isNotable)
            .setType(type?.toProto())

    author?.let {
        builder.setAuthor(
            AuthorProto
                .newBuilder()
                .setId(it.id ?: 0L)
                .setName(it.name)
                .build(),
        )
    }
    category?.let {
        builder.setCategory(
            CategoryProto
                .newBuilder()
                .setId(it.id ?: 0L)
                .setName(it.name)
                .build(),
        )
    }

    return builder.build()
}

fun BookProto.toEntity(): Book =
    Book(
        id = if (id != 0L) id else null,
        title = title,
        description = description,
        price = if (price.isNotEmpty()) BigDecimal(price) else BigDecimal.ZERO,
        stock = stock,
        discount = if (discount.isNotEmpty()) BigDecimal(discount) else BigDecimal.ZERO,
        imageUrl = imageUrl,
        author = if (hasAuthor()) Author(id = author.id, name = "") else null,
        category = if (hasCategory()) Category(id = category.id, name = "") else null,
        isNotable = isNotable,
        type = type.toEntity(),
        createdAt = if (createdAt.isNotBlank()) {
            try { LocalDateTime.parse(createdAt) } catch (e: Exception) { LocalDateTime.now() }
        } else {
            LocalDateTime.now()
        },
    )

fun Page<Book>.toPageResponse(): BookPageResponse =
    BookPageResponse
        .newBuilder()
        .addAllContent(content.map { it.toProto() })
        .setTotalElements(totalElements)
        .setTotalPages(totalPages)
        .setPageNumber(number)
        .setPageSize(size)
        .build()

// --- Category ---
fun Category.toProto(): CategoryProto =
    CategoryProto
        .newBuilder()
        .setId(id ?: 0L)
        .setName(name)
        .setDescription(description ?: "")
        .setCreatedAt(createdAt?.format(dateFormatter) ?: "")
        .setImage(image ?: "")
        .build()

fun Page<Category>.toPageResponse(): CategoryPageResponse =
    CategoryPageResponse
        .newBuilder()
        .addAllContent(content.map { it.toProto() })
        .setTotalElements(totalElements)
        .setTotalPages(totalPages)
        .setPageNumber(number)
        .setPageSize(size)
        .build()

// --- User ---
fun User.toProto(): UserProto {
    val protoRole = when (role) {
        org.datn.backend.domain.entity.Role.ADMIN -> Role.ADMIN
        org.datn.backend.domain.entity.Role.CUSTOMER -> Role.CUSTOMER
        org.datn.backend.domain.entity.Role.AUTHOR -> Role.AUTHOR_ROLE
    }

    val status = historyStatus ?: UserHistoryStatus.NEW_USER
    val protoUserHistoryStatus = when (status) {
        UserHistoryStatus.GOOD_HISTORY -> UserHistoryStatusProto.GOOD_HISTORY
        UserHistoryStatus.BOOM_HISTORY -> UserHistoryStatusProto.BOOM_HISTORY
        UserHistoryStatus.NEW_USER -> UserHistoryStatusProto.NEW_USER
    }

    return UserProto
        .newBuilder()
        .setId(id ?: 0L)
        .setUsername(username)
        .setEmail(email)
        .setFullName(fullName ?: "")
        .setAddress(address ?: "")
        .setPhone(phone ?: "")
        .setRole(protoRole)
        .setAvatar(avatar ?: "")
        .setCreatedAt(createdAt?.format(dateFormatter) ?: "")
        .setHistoryStatus(protoUserHistoryStatus)
        .build()
}

fun UserProto.toEntity(): User {
    val entityRole = when (role) {
        Role.ADMIN -> org.datn.backend.domain.entity.Role.ADMIN
        Role.CUSTOMER -> org.datn.backend.domain.entity.Role.CUSTOMER
        Role.AUTHOR_ROLE -> org.datn.backend.domain.entity.Role.AUTHOR
        else -> org.datn.backend.domain.entity.Role.CUSTOMER
    }

    return User(
        username = username,
        email = email,
        password = "",
        fullName = fullName,
        address = address,
        phone = phone,
        role = entityRole,
        avatar = avatar,
    )
}

fun Page<User>.toPageResponse(): UserPageResponse =
    UserPageResponse
        .newBuilder()
        .addAllContent(content.map { it.toProto() })
        .setTotalElements(totalElements)
        .setTotalPages(totalPages)
        .setPageNumber(number)
        .setPageSize(size)
        .build()

// --- Order ---
fun Order.toProto(): OrderProto {
    val builder = OrderProto.newBuilder()
        .setId(id ?: 0L)
        .setFullName(fullName)
        .setPhone(phone)
        .setAddress(address)
        .setCartId(cartId ?: "")
        .setTotalAmount(totalAmount.toString())
        .setStatus(org.datn.backend.proto.OrderStatus.valueOf(status.name))
        .setCreatedAt(createdAt?.format(dateFormatter) ?: "")
        .setIsCart(isCart)
        .setUser(user.toProto())

    items.forEach { builder.addItems(it.toProto()) }
    return builder.build()
}

fun OrderProto.toEntity(user: User): Order {
    val entity = Order(
        id = if (id != 0L) id else null,
        fullName = fullName,
        phone = phone,
        address = address,
        cartId = cartId,
        totalAmount = BigDecimal(totalAmount),
        status = org.datn.backend.domain.entity.OrderStatus.valueOf(status.name),
        user = user,
        isCart = isCart
    )
    val items = itemsList.map { it.toEntity(entity) }
    entity.items.addAll(items)
    return entity
}

fun Page<Order>.toPageResponse(): OrderPageResponse =
    OrderPageResponse
        .newBuilder()
        .addAllContent(content.map { it.toProto() })
        .setTotalElements(totalElements)
        .setTotalPages(totalPages)
        .setPageNumber(number)
        .setPageSize(size)
        .build()

// --- Order Item ---
fun OrderItem.toProto(): OrderItemProto =
    OrderItemProto
        .newBuilder()
        .setId(id ?: 0L)
        .setBook(book.toProto())
        .setQuantity(quantity)
        .setUnitPrice(unitPrice.toString())
        .setDiscount(discount.toString())
        .build()

fun OrderItemProto.toEntity(order: Order): OrderItem =
    OrderItem(
        id = if (id != 0L) id else null,
        order = order,
        book = Book(id = if (book.id != 0L) book.id else null, title = "", price = BigDecimal.ZERO),
        quantity = quantity,
        unitPrice = BigDecimal(unitPrice),
        discount = BigDecimal(discount),
    )

// --- Message ---
fun MessageSender.toProto(): MessageSenderProto = when (this) {
    MessageSender.USER -> MessageSenderProto.USER
    MessageSender.AI -> MessageSenderProto.AI
}

fun Message.toProto(): MessageResponseProto =
    MessageResponseProto
        .newBuilder()
        .setId(id ?: 0L)
        .setUser(user?.toProto())
        .setSender(sender.toProto())
        .setContent(content)
        .setRelatedBook(relatedBook?.toProto() ?: Book(title = "", price = BigDecimal.ZERO).toProto())
        .setCreatedAt(createdAt?.format(dateFormatter) ?: "")
        .build()

fun Page<Message>.toPageResponse(): MessageResponsePageResponse =
    MessageResponsePageResponse
        .newBuilder()
        .addAllContent(content.map { it.toProto() })
        .setTotalElements(totalElements)
        .setTotalPages(totalPages)
        .setPageNumber(number)
        .setPageSize(size)
        .build()

// --- Voucher ---
fun Voucher.toProto(): VoucherProto =
    VoucherProto
        .newBuilder()
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

fun Page<Voucher>.toPageResponse(): VoucherPageResponse =
    VoucherPageResponse
        .newBuilder()
        .addAllContent(content.map { it.toProto() })
        .setTotalPages(totalPages)
        .setTotalElements(totalElements)
        .build()

// --- WebSetting ---
fun WebSetting.toProto(): WebSettingProto =
    WebSettingProto
        .newBuilder()
        .setId(id ?: 0L)
        .setWebName(webName)
        .setLogoUrl(logoUrl ?: "")
        .setHeaderIcon(headerIcon ?: "BookOpen")
        .setContactEmail(contactEmail ?: "")
        .setFooterText(footerText ?: "")
        .setIsActive(isActive)
        .setUpdatedAt(updatedAt?.toString() ?: "")
        .build()

fun Page<WebSetting>.toPageResponse(): WebSettingPageResponse =
    WebSettingPageResponse
        .newBuilder()
        .addAllContent(content.map { it.toProto() })
        .setTotalPages(totalPages)
        .setTotalElements(totalElements)
        .build()

// --- ActivityLog ---
fun ActivityLog.toProto(): ActivityLogProto =
    ActivityLogProto
        .newBuilder()
        .setId(id ?: 0L)
        .setAction(action)
        .setEntityName(entityName)
        .setDetails(details)
        .setCreatedAt(createdAt?.toString() ?: "")
        .setPerformedBy(performedBy ?: "")
        .build()

fun Page<ActivityLog>.toPageResponse(): ActivityLogPageResponse =
    ActivityLogPageResponse
        .newBuilder()
        .addAllContent(content.map { it.toProto() })
        .setTotalPages(totalPages)
        .setTotalElements(totalElements)
        .build()

// --- QrPayment ---
fun QrPaymentResponse.toProto(): QrPaymentResponseProto =
    QrPaymentResponseProto
        .newBuilder()
        .setQrUrl(qrUrl)
        .setAmount(amount)
        .setOrderId(orderId)
        .setDescription(description)
        .build()
