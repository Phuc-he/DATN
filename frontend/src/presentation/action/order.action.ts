'use server';

import { OrderItem } from "@/src/domain/entity/order-item.entity";
import { OrderStatus } from "@/src/domain/entity/order-status.enum";
import { Order } from "@/src/domain/entity/order.entity";
import { PaymentMethod } from "@/src/domain/entity/payment.method";
import { Voucher } from "@/src/domain/entity/voucher.entity";
import { AppProviders } from "@/src/provider/provider";
import { logActivity } from "@/src/shared/logOrderActivity";
import { revalidatePath } from "next/cache";

export interface CreateOrderDto {
  user: { id: number; fullName?: string; email?: string };
  fullName: string;
  phone: string;
  address: string;
  voucher?: Voucher | null;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  totalAmount: number;
}

export async function createOrderAction(formData: CreateOrderDto) {
  const isGuest = formData.user.id === -1;
  const actor = formData.user.email || formData.fullName || (isGuest ? "Guest" : `User ID: ${formData.user.id}`);

  try {
    // 1. Clean data (ID only)
    const cleanItems = formData.items.map(item => ({
      book: { id: item.book.id },
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount
    }));

    const order: Partial<Order> = {
      // If user.id is -1, it's a guest order, so we don't associate a user ID on the backend
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: !isGuest ? ({ id: formData.user.id } as any) : undefined,
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      items: cleanItems as OrderItem[],
      totalAmount: formData.totalAmount,
      status: OrderStatus.UNPROCESSED,
      isCart: false,
    };

    // 2. Execute Order Creation
    const result = await AppProviders.CreateOrderUseCase.execute(order as Order);

    // Log Order Success
    await logActivity(actor, "Order", "CREATE", `Order #${result.id} created successfully. Total: ${result.totalAmount}`);

    if (formData.voucher) {
      const updateVoucher = formData.voucher;
      updateVoucher.usedCount += 1;
      await AppProviders.UpdateVoucherUseCase.execute(updateVoucher.id || 0, updateVoucher);

      // Log Voucher Usage
      await logActivity(actor, "Order", "VOUCHER_USED", `Voucher ${updateVoucher.code} applied to Order #${result.id}`);
    }

    // 3. Payment Processing (VietQR)
    if (formData.paymentMethod === PaymentMethod.VNQR) {
      try {
        const generateQrCodeUseCase = AppProviders.GenerateQrCodeUseCase;
        const roundedAmount = Math.round(result.totalAmount);

        const qrData = await generateQrCodeUseCase.execute(
          result.id?.toString() || '',
          roundedAmount
        );

        return {
          success: true,
          orderId: result.id,
          paymentMethod: PaymentMethod.VNQR,
          qrData: qrData,
          isGuest // Inform client if this was a guest order so it can be saved to localStorage via OrderContext
        };
      } catch (error) {
        console.error('VietQR Generation Error:', error);
        return {
          success: false,
          message: "Không thể tạo mã QR thanh toán nhưng đơn hàng đã được ghi nhận."
        };
      }
    }

    return {
      success: true,
      orderId: result.id,
      isGuest // Inform client if this was a guest order
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Order creation error:", error);

    // Log Order Failure
    await logActivity(actor, "Order", "ORDER_FAILURE", `Attempted order failed. Error: ${error.message}`);

    return {
      success: false,
      message: error.message || "Không thể đặt hàng, vui lòng thử lại."
    };
  }
}

export async function getMyOrdersAction(userId: number): Promise<{ success: boolean; data?: Order[]; message?: string }> {
  try {
    // Lấy tất cả đơn hàng và lọc theo ID người dùng (number)
    const allOrders = await AppProviders.GetAllOrdersUseCase.execute();
    const userOrders = allOrders.filter(order => order.user?.id === userId);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(userOrders))
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Fetch my orders error:", error);
    return { success: false, message: error.message };
  }
}

export async function getOrderByIdAction(id: number): Promise<{ success: boolean; data?: Order; message?: string }> {
  try {
    const order = await AppProviders.GetOrderUseCase.execute(id);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(order))
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// Add this to your existing 'use server' file

/**
 * Updates the status of an existing order.
 * Used for Cancellation, Marking as Paid, etc.
 */
export async function updateOrderStatusAction(
  orderId: number, 
  newStatus: OrderStatus
): Promise<{ success: boolean; message?: string }> {
  
  // In a real app, you'd get the current user session here to check permissions
  // For now, we use a generic actor for logging
  const actor = "System/User"; 

  try {
    // 1. Fetch current order to check existence and current status
    const currentOrder = await AppProviders.GetOrderUseCase.execute(orderId);
    if (!currentOrder) {
      return { success: false, message: "Không tìm thấy đơn hàng." };
    }

    // 2. Business Logic Validation
    // Example: Cannot cancel an order that is already SHIPPED or DELIVERED
    if (newStatus === OrderStatus.CANCELLED) {
      if (currentOrder.status === OrderStatus.SHIPPED || currentOrder.status === OrderStatus.DELIVERED) {
        return { success: false, message: "Không thể hủy đơn hàng đã được giao hoặc đang vận chuyển." };
      }
    }

    // 3. Update the order status
    // We pass the partial update to the UseCase
    await AppProviders.UpdateOrderUseCase.execute(orderId, {
      ...currentOrder,
      status: newStatus
    });

    // 4. Log the activity
    await logActivity(
      actor, 
      "Order", 
      "UPDATE_STATUS", 
      `Order #${orderId} status changed from ${currentOrder.status} to ${newStatus}`
    );

    // 5. Revalidate the order details page and profile page to show new data
    revalidatePath(`/checkout/order-success`);
    revalidatePath(`/profile/orders`);
    revalidatePath(`/profile/orders/${orderId}`);

    return { success: true };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Update order status error:", error);
    
    await logActivity(
      actor, 
      "Order", 
      "UPDATE_FAILURE", 
      `Failed to update Order #${orderId}. Error: ${error.message}`
    );

    return { 
      success: false, 
      message: error.message || "Lỗi khi cập nhật trạng thái đơn hàng." 
    };
  }
}