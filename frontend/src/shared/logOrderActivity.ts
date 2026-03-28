import { ActivityLog } from "../domain/entity/activity-log.entity";
import { AppProviders } from "../provider/provider";

/**
 * Helper to handle server-side activity logging
 */
export async function logActivity(performedBy: string, entityName: string, action: string, details: string) {
  const log: ActivityLog = {
    id: 0,
    action,
    entityName: entityName,
    details,
    performedBy,
    createdAt: new Date().toISOString()
  };
  try {
    await AppProviders.CreateActivityLogUseCase.execute(log);
  } catch (err) {
    console.error("Server-side Activity Log failed:", err);
  }
}