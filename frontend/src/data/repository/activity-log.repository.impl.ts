import { ActivityLog } from "@/src/domain/entity/activity-log.entity";
import { BaseRepositoryImpl } from "./base.repository.impl";
import { ActivityLogRepository } from "@/src/domain/repository/activity-log.repository";
import { ActivityLogPageResponse, ActivityLogProto, ActivityLogProtoList } from "@/src/generated/schema";

export class ActivityLogRepositoryImpl extends BaseRepositoryImpl<ActivityLog> implements ActivityLogRepository {
  protected listProto = ActivityLogProtoList;
  protected proto = ActivityLogProto;

  protected pageProto = ActivityLogPageResponse;

  constructor() {
    super('api/activity-logs');
  }
}
