import { BaseRepository } from '@/src/domain/repository/base.repository';
import { Voucher } from '@/src/domain/entity/voucher.entity';

export abstract class VoucherRepository extends BaseRepository<Voucher, number> {}
