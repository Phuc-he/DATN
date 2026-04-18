import { ActivityLogRepositoryImpl } from "../data/repository/activity-log.repository.impl";
import { AuthorRepositoryImpl } from "../data/repository/author.repository.impl";
import { BookRepositoryImpl } from "../data/repository/book.repository.impl";
import { CategoryRepositoryImpl } from "../data/repository/category.repository.impl";
import { OrderItemRepositoryImpl } from "../data/repository/order-item.repository.impl";
import { OrderRepositoryImpl } from "../data/repository/order.repository.impl";
import { PaymentRepositoryImpl } from "../data/repository/payment.repository.impl";
import { UserRepositoryImpl } from "../data/repository/user.repository.impl";
import { VoucherRepositoryImpl } from "../data/repository/voucher.repository.impl";
import { WebSettingRepositoryImpl } from "../data/repository/web-setting.repository.impl";
import { CreateActivityLogUseCase, DeleteActivityLogUseCase, GetActivityLogsByPageUseCase, GetActivityLogUseCase, GetAllActivityLogsUseCase, SearchActivityLogsUseCase } from "../domain/use-case/activity-log.usecase";
import { CreateAuthorUseCase, DeleteAuthorUseCase, GetAllAuthorsUseCase, GetAuthorsByPageUseCase, GetAuthorUseCase, UpdateAuthorUseCase } from "../domain/use-case/author.usecase";
import { CreateBookUseCase, DeleteBookUseCase, GetAllBooksUseCase, GetBooksByAuthorUseCase, GetBooksByPageUseCase, GetBookUseCase, GetCategoryStatsUseCase, SearchBooksUseCase, UpdateBookUseCase } from "../domain/use-case/book.usecase";
import { CreateCategoryUseCase, DeleteCategoryUseCase, GetAllCategoriesUseCase, GetCategoriesByPageUseCase, GetCategoryUseCase, SearchCategoriesUseCase, UpdateCategoryUseCase } from "../domain/use-case/category.usecase";
import { CreateOrderItemUseCase, DeleteOrderItemUseCase, GetAllOrderItemsUseCase, GetOrderItemsByPageUseCase, GetOrderItemUseCase, UpdateOrderItemUseCase } from "../domain/use-case/order-item.usecase";
import { CancelOrderUseCase, CreateOrderUseCase, DeleteOrderUseCase, GetAllOrdersUseCase, GetCartByUserUseCase, GetOrdersByPageUseCase, GetOrderUseCase, SearchOrdersUseCase, UpdateOrderByUserIdUseCase, UpdateOrderStatusUseCase, UpdateOrderUseCase } from "../domain/use-case/order.usecase";
import { GeneratePaymentQrUseCase, VerifyPaymentWebhookUseCase } from "../domain/use-case/payment.usecase";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetAllUsersUseCase,
  GetUserByEmailUseCase,
  GetUsersByPageUseCase,
  GetUserUseCase,
  SearchUsersUseCase,
  UpdateHistoryStatusForUserUseCase,
  UpdateUserHistoryStatusUseCase,
  UpdateUserUseCase
} from "../domain/use-case/user.use-case";
import { CreateVoucherUseCase, DeleteVoucherUseCase, GetAllVouchersUseCase, GetVouchersByPageUseCase, GetVoucherUseCase, SearchVouchersUseCase, UpdateVoucherUseCase, ValidateVoucherUseCase } from "../domain/use-case/voucher.use-case";
import { CreateWebSettingUseCase, DeleteWebSettingUseCase, GetActiveWebSettingUseCase, GetAllWebSettingsUseCase, GetWebSettingsByPageUseCase, GetWebSettingUseCase, SearchWebSettingsUseCase, UpdateWebSettingUseCase } from "../domain/use-case/web-setting.use-case";

import { MessageRepositoryImpl } from "../data/repository/message.repository.impl";
import {
  CreateMessageUseCase,
  DeleteMessageUseCase,
  GetMessagesByPageUseCase,
  GetMessagesByUserUseCase,
  RequestMessageUseCase,
  SearchMessagesUseCase,
  TrainAiModelUseCase,
  UpdateMessageUseCase
} from "../domain/use-case/message.usecase";
// --- Repository Instantiation ---
const userRepository = new UserRepositoryImpl();
const categoryRepository = new CategoryRepositoryImpl();
const orderRepository = new OrderRepositoryImpl();
const orderItemRepository = new OrderItemRepositoryImpl();
const bookRepository = new BookRepositoryImpl();
const authorRepository = new AuthorRepositoryImpl();
const paymentRepository = new PaymentRepositoryImpl();
const voucherRepository = new VoucherRepositoryImpl();
const webSettingRepository = new WebSettingRepositoryImpl();
const activityLogRepository = new ActivityLogRepositoryImpl();
const messageRepository = new MessageRepositoryImpl();

export const AppProviders = {
  // --- User Domain ---
  UserRepository: userRepository,
  CreateUserUseCase: new CreateUserUseCase(userRepository),
  GetAllUsersUseCase: new GetAllUsersUseCase(userRepository),
  GetUserUseCase: new GetUserUseCase(userRepository),
  UpdateUserUseCase: new UpdateUserUseCase(userRepository),
  DeleteUserUseCase: new DeleteUserUseCase(userRepository),
  GetUsersByPageUseCase: new GetUsersByPageUseCase(userRepository),
  SearchUsersUseCase: new SearchUsersUseCase(userRepository),
  GetUserByEmailUseCase: new GetUserByEmailUseCase(userRepository),
  UpdateUserHistoryStatusUseCase: new UpdateUserHistoryStatusUseCase(userRepository),
  UpdateHistoryStatusForUserUseCase: new UpdateHistoryStatusForUserUseCase(userRepository),

  // --- Category Domain ---
  CategoryRepository: categoryRepository,
  CreateCategoryUseCase: new CreateCategoryUseCase(categoryRepository),
  GetAllCategoriesUseCase: new GetAllCategoriesUseCase(categoryRepository),
  GetCategoryUseCase: new GetCategoryUseCase(categoryRepository),
  UpdateCategoryUseCase: new UpdateCategoryUseCase(categoryRepository),
  DeleteCategoryUseCase: new DeleteCategoryUseCase(categoryRepository),
  GetCategoriesByPageUseCase: new GetCategoriesByPageUseCase(categoryRepository),
  SearchCategoriesUseCase: new SearchCategoriesUseCase(categoryRepository),

  // --- Order Domain ---
  OrderRepository: orderRepository,
  CreateOrderUseCase: new CreateOrderUseCase(orderRepository),
  GetAllOrdersUseCase: new GetAllOrdersUseCase(orderRepository),
  GetOrderUseCase: new GetOrderUseCase(orderRepository),
  UpdateOrderUseCase: new UpdateOrderUseCase(orderRepository),
  DeleteOrderUseCase: new DeleteOrderUseCase(orderRepository),
  GetOrdersByPageUseCase: new GetOrdersByPageUseCase(orderRepository),
  SearchOrdersUseCase: new SearchOrdersUseCase(orderRepository),
  UpdateOrderStatusUseCase: new UpdateOrderStatusUseCase(orderRepository),
  CancelOrderUseCase: new CancelOrderUseCase(orderRepository),
  GetCartByUserUseCase: new GetCartByUserUseCase(orderRepository),
  UpdateOrderByUserIdUseCase: new UpdateOrderByUserIdUseCase(orderRepository),

  // --- Book Domain ---
  BookRepository: bookRepository,
  CreateBookUseCase: new CreateBookUseCase(bookRepository),
  GetBookUseCase: new GetBookUseCase(bookRepository),
  UpdateBookUseCase: new UpdateBookUseCase(bookRepository),
  DeleteBookUseCase: new DeleteBookUseCase(bookRepository),
  GetBooksByPageUseCase: new GetBooksByPageUseCase(bookRepository),
  SearchBooksUseCase: new SearchBooksUseCase(bookRepository),
  GetAllBooksUseCase: new GetAllBooksUseCase(bookRepository),
  GetCategoryStatsUseCase: new GetCategoryStatsUseCase(bookRepository),
  GetBooksByAuthorUseCase: new GetBooksByAuthorUseCase(bookRepository),

  // --- OrderItem Domain ---
  OrderItemRepository: orderItemRepository,
  CreateOrderItemUseCase: new CreateOrderItemUseCase(orderItemRepository),
  GetAllOrderItemsUseCase: new GetAllOrderItemsUseCase(orderItemRepository),
  GetOrderItemUseCase: new GetOrderItemUseCase(orderItemRepository),
  UpdateOrderItemUseCase: new UpdateOrderItemUseCase(orderItemRepository),
  DeleteOrderItemUseCase: new DeleteOrderItemUseCase(orderItemRepository),
  GetOrderItemsByPageUseCase: new GetOrderItemsByPageUseCase(orderItemRepository),

  // --- Author Domain ---
  AuthorRepository: authorRepository,
  CreateAuthorUseCase: new CreateAuthorUseCase(authorRepository),
  GetAllAuthorsUseCase: new GetAllAuthorsUseCase(authorRepository),
  GetAuthorUseCase: new GetAuthorUseCase(authorRepository),
  UpdateAuthorUseCase: new UpdateAuthorUseCase(authorRepository),
  DeleteAuthorUseCase: new DeleteAuthorUseCase(authorRepository),
  GetAuthorsByPageUseCase: new GetAuthorsByPageUseCase(authorRepository),

  // --- Voucher Domain ---
  VoucherRepository: voucherRepository,
  CreateVoucherUseCase: new CreateVoucherUseCase(voucherRepository),
  GetAllVouchersUseCase: new GetAllVouchersUseCase(voucherRepository),
  GetVoucherUseCase: new GetVoucherUseCase(voucherRepository),
  UpdateVoucherUseCase: new UpdateVoucherUseCase(voucherRepository),
  DeleteVoucherUseCase: new DeleteVoucherUseCase(voucherRepository),
  GetVouchersByPageUseCase: new GetVouchersByPageUseCase(voucherRepository),
  SearchVouchersUseCase: new SearchVouchersUseCase(voucherRepository),
  ValidateVoucherUseCase: new ValidateVoucherUseCase(voucherRepository),

  // --- Payment domain ---
  PaymentRepository: paymentRepository,
  GenerateQrCodeUseCase: new GeneratePaymentQrUseCase(paymentRepository),
  HandleWebhookUseCase: new VerifyPaymentWebhookUseCase(paymentRepository),

  // --- WebSetting Domain ---
  WebSettingRepository: webSettingRepository,
  CreateWebSettingUseCase: new CreateWebSettingUseCase(webSettingRepository),
  GetAllWebSettingsUseCase: new GetAllWebSettingsUseCase(webSettingRepository),
  GetWebSettingUseCase: new GetWebSettingUseCase(webSettingRepository),
  UpdateWebSettingUseCase: new UpdateWebSettingUseCase(webSettingRepository),
  DeleteWebSettingUseCase: new DeleteWebSettingUseCase(webSettingRepository),
  GetWebSettingsByPageUseCase: new GetWebSettingsByPageUseCase(webSettingRepository),
  SearchWebSettingsUseCase: new SearchWebSettingsUseCase(webSettingRepository),
  GetActiveWebSettingUseCase: new GetActiveWebSettingUseCase(webSettingRepository),

  // --- ActivityLog Domain ---
  ActivityLogRepository: activityLogRepository,
  CreateActivityLogUseCase: new CreateActivityLogUseCase(activityLogRepository),
  GetAllActivityLogsUseCase: new GetAllActivityLogsUseCase(activityLogRepository),
  GetActivityLogUseCase: new GetActivityLogUseCase(activityLogRepository),
  DeleteActivityLogUseCase: new DeleteActivityLogUseCase(activityLogRepository),
  GetActivityLogsByPageUseCase: new GetActivityLogsByPageUseCase(activityLogRepository),
  SearchActivityLogsUseCase: new SearchActivityLogsUseCase(activityLogRepository),

  // --- Message Domain (AI Chat & Training) ---
  MessageRepository: messageRepository,
  RequestMessageUseCase: new RequestMessageUseCase(messageRepository),
  CreateMessageUseCase: new CreateMessageUseCase(messageRepository),
  UpdateMessageUseCase: new UpdateMessageUseCase(messageRepository),
  TrainAiModelUseCase: new TrainAiModelUseCase(messageRepository),
  GetMessagesByPageUseCase: new GetMessagesByPageUseCase(messageRepository),
  SearchMessagesUseCase: new SearchMessagesUseCase(messageRepository),
  DeleteMessageUseCase: new DeleteMessageUseCase(messageRepository),
  GetMessagesByUserUseCase: new GetMessagesByUserUseCase(messageRepository),
}