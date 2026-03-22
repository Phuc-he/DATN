'use server';

import { OrderItem } from "@/src/domain/entity/order-item.entity";
import { Order } from "@/src/domain/entity/order.entity";
import { PaymentMethod } from "@/src/domain/entity/payment.method";
import { Voucher } from "@/src/domain/entity/voucher.entity";
import { OrderStatus } from "@/src/domain/entity/order-status.enum";
import { AppProviders } from "@/src/provider/provider";

export interface CreateOrderDto {
  user: { id: number }; // Chuyển từ userId: string sang object User matching entity
  fullName: string;
  phone: string;
  address: string;
  voucher?: Voucher | null;
  items: OrderItem[];   // Đổi tên từ orderItems -> items
  paymentMethod: PaymentMethod;
  totalAmount: number;  // Đổi tên từ totalPrice -> totalAmount
}

export async function createOrderAction(formData: CreateOrderDto) {
  try {
    // 1. Lọc sạch dữ liệu (Chỉ giữ lại ID để giảm dung lượng gói tin)
    const cleanItems = formData.items.map(item => ({
      book: { id: item.book.id }, // QUAN TRỌNG: Chỉ gửi ID, loại bỏ imageUrl và description
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount
    }));

    const order: Partial<Order> = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: { id: formData.user.id } as any, // Tương tự, chỉ gửi ID user
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: cleanItems as any, // Sử dụng mảng đã lọc sạch
      totalAmount: formData.totalAmount,
      status: OrderStatus.UNPROCESSED,
    };

    console.log("Cleaned Order Data:", JSON.stringify(order));

    // 2. Thực thi tạo đơn hàng qua UseCase
    const result = await AppProviders.CreateOrderUseCase.execute(order as Order);
    if (formData.voucher) {
      const updateVoucher = formData.voucher;
      updateVoucher.usedCount += 1;
      const updatedVoucher = await AppProviders.UpdateVoucherUseCase.execute(updateVoucher.id || 0, updateVoucher)
      console.log("updateCount", updatedVoucher)
    }

    // 3. Xử lý thanh toán trực tuyến (Ví dụ VietQR)
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
          qrData: qrData
        };
      } catch (error) {
        console.error('VietQR Generation Error:', error);
        return {
          success: false,
          message: "Không thể tạo mã QR thanh toán nhưng đơn hàng đã được ghi nhận."
        };
      }
    }

    return { success: true, orderId: result.id };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Order creation error:", error);
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