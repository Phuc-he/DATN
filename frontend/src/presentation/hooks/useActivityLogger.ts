// src/presentation/hooks/useActivityLogger.ts
import { useAuth } from './useAuth';
import { AppProviders } from '@/src/provider/provider';
import { ActivityLog } from '@/src/domain/entity/activity-log.entity';

export function useActivityLogger() {
  const { currUser } = useAuth();

  const logAction = async (action: string, entityName: string, details: string) => {
    const log: ActivityLog = {
      id: 0, // Backend generates this
      action,
      entityName,
      details,
      performedBy: currUser?.fullName || currUser?.email || 'Anonymous Admin',
      createdAt: new Date().toISOString()
    };

    try {
      await AppProviders.CreateActivityLogUseCase.execute(log);
    } catch (error) {
      console.error("Failed to push manual activity log:", error);
    }
  };

  return { logAction };
}