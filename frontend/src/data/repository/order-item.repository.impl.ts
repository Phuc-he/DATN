import { OrderItem } from "@/src/domain/entity/order-item.entity";
import { OrderItemRepository } from "@/src/domain/repository/order-item.repository";
import { OrderItemPageResponse, OrderItemProto } from "@/src/generated/schema";
import { BaseRepositoryImpl } from "./base.repository.impl";

export class OrderItemRepositoryImpl extends BaseRepositoryImpl<OrderItem> implements OrderItemRepository {
  protected listProto = null;
  protected proto = OrderItemProto;

  protected pageProto = OrderItemPageResponse;

  constructor() {
    super('api/order-items');
  }
}