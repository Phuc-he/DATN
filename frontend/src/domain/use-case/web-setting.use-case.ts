// src/domain/use-case/WebSetting/WebSetting.use-case.ts

import { PaginatedResult } from '@/src/domain/entity/paginated.result';
import { WebSetting } from '@/src/domain/entity/web-setting.entity';
import { WebSettingRepository } from '@/src/domain/repository/web-setting.repository';
import { Constants } from '@/src/shared/constans';


export class CreateWebSettingUseCase {
  constructor(private readonly WebSettingRepository: WebSettingRepository) { }

  async execute(WebSetting: WebSetting): Promise<WebSetting> {

    return this.WebSettingRepository.create(WebSetting);
  }
}


export class GetAllWebSettingsUseCase {
  constructor(private readonly WebSettingRepository: WebSettingRepository) { }

  async execute(): Promise<WebSetting[]> {
    return this.WebSettingRepository.findAll();
  }
}


export class GetWebSettingUseCase {
  constructor(private readonly WebSettingRepository: WebSettingRepository) { }

  async execute(id: number): Promise<WebSetting> {
    const WebSetting = await this.WebSettingRepository.findById(id);
    if (!WebSetting) {
      throw new Error(`WebSetting with ID ${id} not found`);
    }
    return WebSetting;
  }
}


export class UpdateWebSettingUseCase {
  constructor(private readonly WebSettingRepository: WebSettingRepository) { }

  async execute(
    id: number,
    data: Partial<WebSetting>,
  ): Promise<WebSetting | null> {
    const updated = await this.WebSettingRepository.update(id, data);
    if (!updated) {
      throw new Error(`WebSetting with ID ${id} not found`);
    }
    return updated;
  }
}


export class DeleteWebSettingUseCase {
  constructor(private readonly WebSettingRepository: WebSettingRepository) { }

  async execute(id: number): Promise<boolean> {
    const deleted = await this.WebSettingRepository.delete(id);
    if (!deleted) {
      throw new Error(`WebSetting with ID ${id} could not be deleted`);
    }
    return deleted;
  }
}

export class GetActiveWebSettingUseCase {
  constructor(private readonly WebSettingRepository: WebSettingRepository) { }

  async execute(): Promise<WebSetting> {
    
    return await this.WebSettingRepository.getActive();
  }
}


export class GetWebSettingsByPageUseCase {
  constructor(private readonly WebSettingRepository: WebSettingRepository) { }

  async execute(
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<WebSetting>> {
    return this.WebSettingRepository.findByPage(page, limit);
  }
}


export class SearchWebSettingsUseCase {
  constructor(private readonly WebSettingRepository: WebSettingRepository) { }

  async execute(
    query: string,
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<WebSetting>> {
    return this.WebSettingRepository.search(query, page, limit);
  }
}
