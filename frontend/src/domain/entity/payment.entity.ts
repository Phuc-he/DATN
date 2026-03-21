/**
 * Represents the Payment QR data returned from the backend.
 * This entity is used by the UI to display the VietQR image and 
 * payment instructions to the customer.
 */
export interface Payment {
  /** The generated URL for the VietQR image */
  qrUrl: string;

  /** * The total amount for the transaction.
   * Using number in TS to match Long in Kotlin.
   */
  amount: number;

  /** The unique identifier of the order being paid for */
  orderId: string;

  /** The transfer content (e.g., "Thanh toan don hang ORD123") */
  description: string;
}