import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from './order-status.enum';

/**
 * Represents the Order domain model.
 * Matches org.datn.backend.domain.entity.Order
 */
export interface Order {
  id?: number;
  user: User;
  fullName: string;
  phone: string;
  address: string;
  cartId?: string;
  totalAmount: number; // BigDecimal maps to number for UI
  status: OrderStatus;
  items: OrderItem[];  // @OneToMany relationship
}

/**
 * Initial state for a new order checkout
 */
export const EmptyOrder: Partial<Order> = {
  fullName: '',
  phone: '',
  address: '',
  totalAmount: 0,
  status: OrderStatus.UNPROCESSED,
  items: []
};