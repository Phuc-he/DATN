import { Order } from "../entity/order.entity";
import { BaseRepository } from "./base.repository";

export abstract class OrderRepository extends BaseRepository<Order, number> { }
