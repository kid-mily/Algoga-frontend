export type BlacklistTab = "candidates" | "blacklist";

export type BlacklistStatus = "NORMAL" | "BLACKLISTED" | "DEREGISTERED" | "UNKNOWN";

export type ReportHistoryStatus = "RECEIVED" | "COMPLETED" | "REJECTED" | "UNKNOWN";

export type ReportHistoryTargetType = "POST" | "COMMENT" | "USER" | "UNKNOWN";

export type BlacklistUser = {
  userId: number;
  displayId: string;
  name: string;
  nickname: string;
  email: string;
  reportCount: number;
  lastReportedAt: string;
  registeredAt: string;
  managerName: string;
  status: BlacklistStatus;
};

export type BlacklistUserDetail = BlacklistUser & {
  phone: string;
  joinedAt: string;
};

export type ReportHistory = {
  reportId: number;
  displayId: string;
  targetType: ReportHistoryTargetType;
  reasonType: string;
  createdAt: string;
  status: ReportHistoryStatus;
};

export type PageResult<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
