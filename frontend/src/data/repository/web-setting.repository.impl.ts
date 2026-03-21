import { WebSetting } from "@/src/domain/entity/web-setting.entity";
import { WebSettingRepository } from "@/src/domain/repository/web-setting.repository";
import { WebSettingPageResponse, WebSettingProto } from "@/src/generated/schema";
import { BaseRepositoryImpl } from "./base.repository.impl";

export class WebSettingRepositoryImpl extends BaseRepositoryImpl<WebSetting> implements WebSettingRepository {
  protected listProto = null;
  protected proto = WebSettingProto;

  protected pageProto = WebSettingPageResponse;

  constructor() {
    super('api/settings');
  }
  async getActive(): Promise<WebSetting> {
    try {
      // Use this.api from BaseRepositoryImpl
      // The endpoint is /api/settings/active
      const response = await this.api.get(`/${this.endpoint}/active`);

      // Decode using the generated WebSettingProto.decode method
      // We wrap response.data in Uint8Array because axios arraybuffer returns a Buffer/ArrayBuffer
      const decodedProto = this.proto.decode(new Uint8Array(response.data));

      // Map the decoded proto message to your Domain Entity
      return new WebSetting({
        id: decodedProto.id,
        webName: decodedProto.webName,
        logoUrl: decodedProto.logoUrl,
        headerIcon: decodedProto.headerIcon,
        contactEmail: decodedProto.contactEmail,
        footerText: decodedProto.footerText,
        isActive: decodedProto.isActive,
        updatedAt: decodedProto.updatedAt,
      });
    } catch (error) {
      console.error("Error fetching active web settings:", error);
      
      // Fallback: Return a default WebSetting to prevent UI crashes during your DATN demo
      return new WebSetting({
        webName: "Default Bookstore",
        headerIcon: "BookOpen",
        isActive: true
      });
    }
  }
}