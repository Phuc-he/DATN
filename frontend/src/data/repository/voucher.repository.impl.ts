import { Voucher } from "@/src/domain/entity/voucher.entity";
import { VoucherRepository } from "@/src/domain/repository/voucher.repository";
import { VoucherPageResponse, VoucherProto } from "@/src/generated/schema";
import { BaseRepositoryImpl } from "./base.repository.impl";
import { DiscountType } from "@/src/domain/entity/discount-type.enum";

export class VoucherRepositoryImpl extends BaseRepositoryImpl<Voucher> implements VoucherRepository {
  protected listProto = null;
  protected proto = VoucherProto;

  protected pageProto = VoucherPageResponse;

  constructor() {
    super('api/vouchers');
  }
  async validateVoucher(code: string, amount: number): Promise<Voucher | null> {
    try {
      const response = await this.api.get(`/${this.endpoint}/validate`, {
        params: {
          code,
          amount
        },
        // BaseRepositoryImpl đã cấu hình responseType: 'arraybuffer' và headers Accept
      });

      if (!response.data || response.data.byteLength === 0) {
        return null;
      }

      const decodedProto = this.proto?.decode(new Uint8Array(response.data));

      // Sử dụng mapper thay vì ép kiểu trực tiếp
      return this.mapProtoToEntity(decodedProto);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Nếu Backend trả về 400 hoặc 404 (Voucher không hợp lệ/hết hạn)
      console.error("Voucher validation failed:", error.message);
      return null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapProtoToEntity(proto: any): Voucher {
    return {
      id: proto.id,
      code: proto.code,
      discountType: proto.discountType as unknown as DiscountType,
      discountValue: proto.discountValue,

      // Khớp với các field mới trong domain entity của bạn
      minOrderValue: proto.minOrderValue,
      maxUses: proto.maxUses,
      usedCount: proto.usedCount || 0,

      // LocalDateTime từ Spring Boot trả về dạng ISO String
      startDate: proto.startDate,
      expirationDate: proto.expirationDate, // Thay cho endDate

      isActive: proto.isActive !== undefined ? proto.isActive : true
    };
  }
}