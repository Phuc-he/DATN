import { Order } from "@/src/domain/entity/order.entity";
import { OrderRepository } from "@/src/domain/repository/order.repository";
import { OrderPageResponse, OrderProto, OrderProtoList } from "@/src/generated/schema";
import { BaseRepositoryImpl } from "./base.repository.impl";
import { OrderStatus } from "@/src/domain/entity/order-status.enum";

export class OrderRepositoryImpl extends BaseRepositoryImpl<Order> implements OrderRepository {
  protected listProto = OrderProtoList;
  protected proto = OrderProto;

  protected pageProto = OrderPageResponse;

  constructor() {
    super('api/orders');
  }
  async cancelOrder(id: number): Promise<null> {
    try {
      // Sử dụng this.api (AxiosInstance) để gửi yêu cầu POST
      const response = await this.api.post(`/${this.endpoint}/${id}/cancel`);

      // Kiểm tra status 204 (No Content) hoặc 200/201 tùy theo cách BE xử lý thành công
      if (response.status === 204 || response.status === 200) {
        console.log(`Order ${id} cancelled successfully.`);
        return null;
      }

      return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Xử lý lỗi (ví dụ: đơn hàng không tồn tại hoặc không thể hủy ở trạng thái hiện tại)
      console.error(`Failed to cancel order ${id}:`, error.response?.data || error.message);
      
      // Bạn có thể ném lỗi ra ngoài để UI hiển thị thông báo cho người dùng
      throw new Error(error.response?.data?.message || "Could not cancel the order.");
    }
  }
  async updateStatus(id: number, orderStatus: OrderStatus): Promise<Order | null> {
    try {
      const response = await this.api.patch(
        `/${this.endpoint}/${id}/status`,
        {}, // Body trống vì status được gửi qua RequestParam
        {
          params: { status: orderStatus }, // Gửi status dưới dạng Query Param
          // BaseRepositoryImpl đã cấu hình responseType: 'arraybuffer'
        }
      );

      if (!response.data || response.data.byteLength === 0) {
        return null;
      }

      // Giải mã Protobuf nhận được từ Backend
      const decodedProto = this.proto?.decode(new Uint8Array(response.data));
      
      // Nếu bạn gặp lỗi overlap type như ở Voucher, hãy dùng mapper hoặc ép kiểu unknown
      return decodedProto as unknown as Order;
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`Failed to update status for order ${id}:`, error.message);
      return null;
    }
  }
}