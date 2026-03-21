import { Order } from "@/src/domain/entity/order.entity";
import { OrderRepository } from "@/src/domain/repository/order.repository";
import { BookPageResponse, BookProto } from "@/src/generated/schema";
import { BaseRepositoryImpl } from "./base.repository.impl";

export class OrderRepositoryImpl extends BaseRepositoryImpl<Order> implements OrderRepository {
  protected proto = BookProto;

  protected pageProto = BookPageResponse;

  constructor() {
    super('api/orders');
  }
}