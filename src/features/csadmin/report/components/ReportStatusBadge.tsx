import { reportStatusLabel, ReportStatus } from "../types";

const statusClassName: Record<ReportStatus, string> = {
  RECEIVED: "bg-[#FFF7E6] text-[#B54708]",
  REJECTED: "bg-[#FEE4E2] text-[#B42318]",
  COMPLETED: "bg-[#E7F6EC] text-[#027A48]",
};

export default function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={`inline-flex h-[28px] items-center rounded-full px-3 text-[12px] font-bold ${statusClassName[status]}`}
    >
      {reportStatusLabel[status]}
    </span>
  );
}
