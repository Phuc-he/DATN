import { OrderItem } from "../entity/order-item.entity";
import { BaseRepository } from "./base.repository";

export abstract class OrderItemRepository extends BaseRepository<OrderItem, number> { }
