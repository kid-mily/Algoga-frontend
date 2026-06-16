import Link from "next/link";
import {
  AdminReport,
  reportTargetTypeLabel,
} from "@/features/csadmin/report/types";
import ReportStatusBadge from "./ReportStatusBadge";

export default function ReportRow({ report }: { report: AdminReport }) {
  return (
    <tr className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
      <td className="px-4 py-4 font-semibold text-[#111827]">
        #{report.reportId}
      </td>
      <td className="px-4 py-4">
        <span className="font-semibold text-[#111827]">
          {reportTargetTypeLabel[report.targetType]}
        </span>
        <p className="mt-1 text-[12px] text-[#98A2B3]">
          대상 ID {report.targetId}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="font-semibold text-[#111827]">{report.reporterName}</p>
        <p className="mt-1 text-[12px] text-[#98A2B3]">회원 #{report.reporterId}</p>
      </td>
      <td className="px-4 py-4">
        <p className="line-clamp-2">{report.reason}</p>
      </td>
      <td className="px-4 py-4">{report.createdAt}</td>
      <td className="px-4 py-4">
        <ReportStatusBadge status={report.status} />
      </td>
      <td className="px-4 py-4">
        <Link
          href={`/csadmin/reports/${report.reportId}`}
          className="inline-flex h-[34px] items-center rounded-[8px] border border-[#D0D5DD] px-3 text-[13px] font-semibold text-[#344054]"
        >
          상세 보기
        </Link>
      </td>
    </tr>
  );
}
