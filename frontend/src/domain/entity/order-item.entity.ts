import { Order } from './order.entity';
import { Book } from './book.entity';

/**
 * Represents a single line item within an Order.
 * Matches org.datn.backend.domain.entity.OrderItem
 */
export interface OrderItem {
  id?: number;
  
  // Relationships
  /** * Note: In a recursive JSON structure, we often omit 'order' 
   * inside the Item to avoid circular dependency errors.
   */
  order?: Order; 
  book: Book;

  // Data fields
  quantity: number;
  unitPrice: number; // BigDecimal maps to number
  discount: number;  // Default is 0
}

/**
 * Helper to calculate the subtotal for this specific line item
 */
export const calculateItemSubtotal = (item: OrderItem): number => {
  const priceAfterDiscount = item.unitPrice - item.discount;
  return priceAfterDiscount * item.quantity;
};