import { BlacklistStatus, ReportHistoryStatus } from "../types";

const blacklistStatusLabel: Record<BlacklistStatus, string> = {
  NORMAL: "정상",
  BLACKLISTED: "차단 중",
  DEREGISTERED: "해제",
  UNKNOWN: "-",
};

const reportStatusLabel: Record<ReportHistoryStatus, string> = {
  RECEIVED: "접수",
  COMPLETED: "처리 완료",
  REJECTED: "반려",
  UNKNOWN: "-",
};

export function BlacklistStatusBadge({ status }: { status: BlacklistStatus }) {
  const isBlocked = status === "BLACKLISTED";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${
        isBlocked
          ? "bg-[#FEE2E2] text-[#DC2626]"
          : "bg-[#DCFCE7] text-[#16A34A]"
      }`}
    >
      {blacklistStatusLabel[status]}
    </span>
  );
}

export function ReportStatusBadge({ status }: { status: ReportHistoryStatus }) {
  const style =
    status === "COMPLETED"
      ? "bg-[#DCFCE7] text-[#16A34A]"
      : status === "REJECTED"
        ? "bg-[#F2F4F7] text-[#667085]"
        : "bg-[#FFF7E6] text-[#B54708]";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${style}`}>
      {reportStatusLabel[status]}
    </span>
  );
}
