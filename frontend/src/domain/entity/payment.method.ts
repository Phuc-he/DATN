export enum PaymentMethod {
  COD = 'COD',
  VNQR = 'VnQr',
}

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.COD]: 'Thanh toán khi nhận hàng',
  [PaymentMethod.VNQR]: "VnQr"
};