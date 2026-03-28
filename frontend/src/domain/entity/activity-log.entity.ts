// src/domain/entity/activity-log.entity.ts
export interface ActivityLog {
  id: number;
  action: string;
  entityName: string;
  details: string;
  performedBy: string;
  createdAt: string;
}