export type ReportTargetType = "POST" | "COMMENT";
export type ReportStatus = "PENDING" | "REJECTED" | "COMPLETED";

export interface AdminReport {
  reportId: number;
  reporterId: number;
  reporterName: string;
  targetType: ReportTargetType;
  targetId: number;
  reason: string;
  content: string;
  status: ReportStatus;
  createdAt: string;
  processedAt?: string | null;
}

export interface AdminReportPage {
  reports: AdminReport[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export type RawReportRecord = Record<string, unknown>;

export const reportStatusLabel: Record<ReportStatus, string> = {
  PENDING: "처리 대기",
  REJECTED: "반려",
  COMPLETED: "처리 완료",
};

export const reportTargetTypeLabel: Record<ReportTargetType, string> = {
  POST: "게시글",
  COMMENT: "댓글",
};
