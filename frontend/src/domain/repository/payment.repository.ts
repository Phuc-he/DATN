// src/domain/repository/payment.repository.ts

import { Payment } from "../entity/payment.entity";

export abstract class PaymentRepository {
  /**
   * Tạo chuỗi URL hoặc Data cho mã QR
   */
  abstract generateQrCode(
    orderId: string, 
    amount: number
  ): Promise<Payment>;

  /**
   * Xác thực dữ liệu Webhook từ bên thứ 3 (Casso/SePay)
   * Trả về mã đơn hàng nếu hợp lệ
   */
  abstract verifyWebhook(body: unknown): Promise<{ orderId: string; amount: number } | null>;
}