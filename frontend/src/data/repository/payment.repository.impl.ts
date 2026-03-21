// src/domain/repository/payment.repository.ts
import { PaymentRepository } from "@/src/domain/repository/payment.repository";
import { BaseRepositoryImpl } from "./base.repository.impl";
import { QrPaymentResponseProto } from "@/src/generated/schema"; // Assuming this is your generated proto name
import { Payment } from "@/src/domain/entity/payment.entity";

export class PaymentRepositoryImpl extends BaseRepositoryImpl<unknown> implements PaymentRepository {
  // Use the Proto message we defined for payments
  protected proto = QrPaymentResponseProto;
  protected pageProto = null; // No pagination needed for QR generation

  constructor() {
    super('api/payments');
  }

  /**
   * Hits GET /api/payments/generate/{orderId}?amount={amount}
   * Decodes the binary Protobuf response into a JS object.
   */
  async generateQrCode(orderId: string, amount: number): Promise<Payment> {
    const response = await this.api.get(`/${this.endpoint}/generate/${orderId}`, {
      params: { amount }
    });

    // decode binary buffer from Axios (responseType: 'arraybuffer')
    const decoded = this.proto.decode(new Uint8Array(response.data));

    return {
      qrUrl: decoded.qrUrl || '',
      description: decoded.description || '',
      amount: Number(decoded.amount), // Ensure it's a number (Proto int64 can be string/Long)
      orderId: decoded.orderId  || ''
    };
  }

  /**
   * For webhooks, we typically send/receive JSON from external providers.
   * If your backend handles the verification, we call it here.
   */
  async verifyWebhook(body: unknown): Promise<{ orderId: string; amount: number; } | null> {
    // This usually hits a POST endpoint that verifies the payment signature
    const response = await this.api.post(`/${this.endpoint}/verify`, body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json' // Override the default 'arraybuffer' for this specific call
    });

    return response.data;
  }
}