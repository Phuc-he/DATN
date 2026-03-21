import { DiscountType } from "./discount-type.enum";

export class Voucher {
  id?: number; // Long in Kotlin
  code!: string;
  discountType!: DiscountType;
  discountValue!: number; // Double in Kotlin
  minOrderValue?: number; // Double in Kotlin
  maxUses!: number; // Int in Kotlin
  usedCount: number = 0;
  
  /**
   * Received as ISO String from Spring Boot (LocalDateTime)
   * Example: "2026-03-21T18:17:24"
   */
  startDate!: string; 
  expirationDate!: string;
  
  isActive: boolean = true;

  /**
   * Optional helper to check if the voucher is currently valid on the client side
   */
  static isValid(voucher: Voucher): boolean {
    const now = new Date();
    const start = new Date(voucher.startDate);
    const end = new Date(voucher.expirationDate);
    
    return (
      voucher.isActive &&
      voucher.usedCount < voucher.maxUses &&
      now >= start &&
      now <= end
    );
  }
}