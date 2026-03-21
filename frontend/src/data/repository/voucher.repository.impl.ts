import { Voucher } from "@/src/domain/entity/voucher.entity";
import { VoucherRepository } from "@/src/domain/repository/voucher.repository";
import { VoucherPageResponse, VoucherProto } from "@/src/generated/schema";
import { BaseRepositoryImpl } from "./base.repository.impl";

export class VoucherRepositoryImpl extends BaseRepositoryImpl<Voucher> implements VoucherRepository {
  protected listProto = null;
  protected proto = VoucherProto;

  protected pageProto = VoucherPageResponse;

  constructor() {
    super('api/vouchers');
  }
}