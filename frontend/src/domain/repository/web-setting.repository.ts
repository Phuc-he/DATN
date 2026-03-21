import { BaseRepository } from '@/src/domain/repository/base.repository';
import { WebSetting } from '../entity/web-setting.entity';

export abstract class WebSettingRepository extends BaseRepository<WebSetting, number> {
  abstract getActive(): Promise<WebSetting>;
}
