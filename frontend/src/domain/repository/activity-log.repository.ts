import { ActivityLog } from "../entity/activity-log.entity";
import { BaseRepository } from "./base.repository";

export abstract class ActivityLogRepository extends BaseRepository<ActivityLog, number> { }
