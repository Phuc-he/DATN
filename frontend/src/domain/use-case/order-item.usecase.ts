import { OrderItem } from '@/src/domain/entity/order-item.entity';
import { OrderItemRepository } from '@/src/domain/repository/order-item.repository';
import { PaginatedResult } from '@/src/domain/entity/paginated.result';
import { Constants } from '@/src/shared/constans';

export class CreateOrderItemUseCase {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  async execute(orderItem: OrderItem): Promise<OrderItem> {
    return this.orderItemRepository.create(orderItem);
  }
}

export class GetAllOrderItemsUseCase {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  async execute(): Promise<OrderItem[]> {
    return this.orderItemRepository.findAll();
  }
}

export class GetOrderItemUseCase {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  async execute(id: number): Promise<OrderItem> {
    const item = await this.orderItemRepository.findById(id);
    if (!item) {
      throw new Error(`OrderItem with ID ${id} not found`);
    }
    return item;
  }
}

export class UpdateOrderItemUseCase {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  async execute(
    id: number,
    data: Partial<OrderItem>,
  ): Promise<OrderItem | null> {
    const updatedItem = await this.orderItemRepository.update(id, data);
    if (!updatedItem) {
      throw new Error(`OrderItem with ID ${id} not found`);
    }
    return updatedItem;
  }
}

export class DeleteOrderItemUseCase {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  async execute(id: number): Promise<boolean> {
    const deleted = await this.orderItemRepository.delete(id);
    if (!deleted) {
      throw new Error(`OrderItem with ID ${id} could not be deleted`);
    }
    return deleted;
  }
}

export class GetOrderItemsByPageUseCase {
  constructor(private readonly orderItemRepository: OrderItemRepository) {}

  async execute(
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<OrderItem>> {
    return this.orderItemRepository.findByPage(page, limit);
  }
}