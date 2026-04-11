export enum UserHistoryStatus {
  NEW_USER = 0,
  GOOD_HISTORY = 1,
  BOOM_HISTORY = 2,
}

export const RoleLabels: Record<UserHistoryStatus, string> = {
  [UserHistoryStatus.NEW_USER]: 'Người dùng mới',
  [UserHistoryStatus.GOOD_HISTORY]: 'Lịch sử tốt',
  [UserHistoryStatus.BOOM_HISTORY]: 'Từng boom hàng'
};