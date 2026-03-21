// src/domain/use-case/voucher/voucher.use-case.ts

import { PaginatedResult } from '@/src/domain/entity/paginated.result';
import { Voucher } from '@/src/domain/entity/voucher.entity';
import { VoucherRepository } from '@/src/domain/repository/voucher.repository';
import { Constants } from '@/src/shared/constans';


export class CreateVoucherUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) { }

  async execute(voucher: Voucher): Promise<Voucher> {

    return this.voucherRepository.create(voucher);
  }
}


export class GetAllVouchersUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) { }

  async execute(): Promise<Voucher[]> {
    return this.voucherRepository.findAll();
  }
}


export class GetVoucherUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) { }

  async execute(id: number): Promise<Voucher> {
    const voucher = await this.voucherRepository.findById(id);
    if (!voucher) {
      throw new Error(`Voucher with ID ${id} not found`);
    }
    return voucher;
  }
}


export class UpdateVoucherUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) { }

  async execute(
    id: number,
    data: Partial<Voucher>,
  ): Promise<Voucher | null> {
    const updated = await this.voucherRepository.update(id, data);
    if (!updated) {
      throw new Error(`Voucher with ID ${id} not found`);
    }
    return updated;
  }
}


export class DeleteVoucherUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) { }

  async execute(id: number): Promise<boolean> {
    const deleted = await this.voucherRepository.delete(id);
    if (!deleted) {
      throw new Error(`Voucher with ID ${id} could not be deleted`);
    }
    return deleted;
  }
}


export class GetVouchersByPageUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) { }

  async execute(
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Voucher>> {
    return this.voucherRepository.findByPage(page, limit);
  }
}


export class SearchVouchersUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) { }

  async execute(
    query: string,
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Voucher>> {
    return this.voucherRepository.search(query, page, limit);
  }
}
