import { Payment } from "../entity/payment.entity";
import { PaymentRepository } from "../repository/payment.repository";

/**
 * UseCase to generate the VietQR payment information.
 * Called when the user reaches the "Payment" step of checkout.
 */
export class GeneratePaymentQrUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(orderId: string, amount: number): Promise<Payment> {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    return this.paymentRepository.generateQrCode(orderId, amount);
  }
}

/**
 * UseCase to verify a payment webhook.
 * Although typically handled by the backend, this can be used 
 * if you are simulating a client-side verification or handling 
 * direct gateway responses.
 */
export class VerifyPaymentWebhookUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(body: unknown): Promise<{ orderId: string; amount: number } | null> {
    if (!body) {
      throw new Error("Webhook body is empty");
    }
    return this.paymentRepository.verifyWebhook(body);
  }
}