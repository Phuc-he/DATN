import { Order } from '@/src/domain/entity/order.entity';
import { OrderRepository } from '@/src/domain/repository/order.repository';
import { PaginatedResult } from '@/src/domain/entity/paginated.result';
import { Constants } from '@/src/shared/constans';
import { OrderStatus } from '../entity/order-status.enum';

/**
 * Places a new order during checkout.
 */
export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(order: Order): Promise<Order> {
    return this.orderRepository.create(order);
  }
}

/**
 * Retrieves all orders (typically for an admin list view).
 */
export class GetAllOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}

/**
 * Retrieves a specific order by its numeric ID (Spring Long).
 */
export class GetOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: number): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    return order;
  }
}

/**
 * Updates order details (e.g., status updates like 'SHIPPED' or 'CANCELLED').
 */
export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(
    id: number,
    data: Partial<Order>,
  ): Promise<Order | null> {
    const updatedOrder = await this.orderRepository.update(id, data);
    if (!updatedOrder) {
      throw new Error(`Order with ID ${id} not found or update failed`);
    }
    return updatedOrder;
  }
}

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(
    id: number, orderStatus: OrderStatus
  ): Promise<Order | null> {
    const updatedOrder = await this.orderRepository.updateStatus(id, orderStatus);
    if (!updatedOrder) {
      throw new Error(`Order with ID ${id} not found or update failed`);
    }
    return updatedOrder;
  }
}

export class CancelOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}
  async execute(
    id: number,
  ): Promise<null> {
    return await this.orderRepository.cancelOrder(id);
  }
}

/**
 * Removes an order record.
 */
export class DeleteOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: number): Promise<boolean> {
    const deleted = await this.orderRepository.delete(id);
    if (!deleted) {
      throw new Error(`Order with ID ${id} could not be deleted`);
    }
    return deleted;
  }
}

/**
 * Fetches orders in pages for the Admin Dashboard or Order History.
 */
export class GetOrdersByPageUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Order>> {
    return this.orderRepository.findByPage(page, limit);
  }
}

/**
 * Searches orders by keyword (matches the custom Query in your Kotlin backend).
 */
export class SearchOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(
    query: string,
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Order>> {
    return this.orderRepository.search(query, page, limit);
  }
}