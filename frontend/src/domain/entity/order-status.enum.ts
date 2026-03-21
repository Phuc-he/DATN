/**
 * Matches org.datn.backend.domain.entity.OrderStatus
 * used for tracking the lifecycle of an Order in the system.
 */
export enum OrderStatus {
  UNPROCESSED = 'UNPROCESSED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

/**
 * Utility to get a user-friendly label or color for the UI
 */
export const getOrderStatusDetails = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.UNPROCESSED:
      return { label: 'Chờ xử lý', color: 'bg-gray-500' };
    case OrderStatus.PROCESSING:
      return { label: 'Đang xử lý', color: 'bg-blue-500' };
    case OrderStatus.SHIPPED:
      return { label: 'Đang giao hàng', color: 'bg-yellow-500' };
    case OrderStatus.DELIVERED:
      return { label: 'Đã giao hàng', color: 'bg-green-500' };
    case OrderStatus.CANCELLED:
      return { label: 'Đã hủy', color: 'bg-red-500' };
    default:
      return { label: 'Không xác định', color: 'bg-gray-300' };
  }
};