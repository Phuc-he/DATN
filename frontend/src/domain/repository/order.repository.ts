import { OrderStatus } from "../entity/order-status.enum";
import { Order } from "../entity/order.entity";
import { BaseRepository } from "./base.repository";

export abstract class OrderRepository extends BaseRepository<Order, number> { 
  abstract updateStatus(id: number, orderStatus: OrderStatus): Promise<Order | null>;
  abstract cancelOrder(id: number): Promise<null>;
}
