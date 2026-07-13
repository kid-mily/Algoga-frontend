import { ReportHistoryStatus } from "../types";

const reportStatusLabel: Record<ReportHistoryStatus, string> = {
  RECEIVED: "접수",
  COMPLETED: "처리 완료",
  REJECTED: "반려",
  UNKNOWN: "-",
};

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
