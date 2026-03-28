import { ActivityLog } from '@/src/domain/entity/activity-log.entity';
import { ActivityLogRepository } from '@/src/domain/repository/activity-log.repository';
import { PaginatedResult } from '@/src/domain/entity/paginated.result';
import { Constants } from '@/src/shared/constans';

/**
 * Use case to log a new action in the system.
 * Should be called after successful Create/Update/Delete operations in other domains.
 */
export class CreateActivityLogUseCase {
  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  async execute(log: ActivityLog): Promise<ActivityLog> {
    return this.activityLogRepository.create(log);
  }
}

/**
 * Retrieves paginated activity logs for the dashboard "Latest Activity" feed.
 */
export class GetActivityLogsByPageUseCase {
  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  async execute(
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<ActivityLog>> {
    return this.activityLogRepository.findByPage(page, limit);
  }
}

/**
 * Search through logs (e.g., searching for "Book" to see all book-related changes).
 */
export class SearchActivityLogsUseCase {
  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  async execute(
    query: string,
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<ActivityLog>> {
    return this.activityLogRepository.search(query, page, limit);
  }
}

/**
 * Retrieves a single log entry if detailed inspection is needed.
 */
export class GetActivityLogUseCase {
  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  async execute(id: number): Promise<ActivityLog> {
    const log = await this.activityLogRepository.findById(id);
    if (!log) {
      throw new Error(`Log entry with ID ${id} not found`);
    }
    return log;
  }
}

/**
 * Use case to clear/delete logs (Admin only operation).
 */
export class DeleteActivityLogUseCase {
  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  async execute(id: number): Promise<boolean> {
    const deleted = await this.activityLogRepository.delete(id);
    if (!deleted) {
       throw new Error(`Log entry ${id} could not be deleted`);
    }
    return deleted;
  }
}

/**
 * Use case to fetch all logs without pagination (e.g., for exporting to CSV).
 */
export class GetAllActivityLogsUseCase {
  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  async execute(): Promise<ActivityLog[]> {
    return this.activityLogRepository.findAll();
  }
}