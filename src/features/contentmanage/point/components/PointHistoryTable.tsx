import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import { PointHistory } from "../types";
import PointHistoryRow from "./PointHistoryRow";

interface PointHistoryTableProps {
  logs: PointHistory[];
  isLoading: boolean;
}

export default function PointHistoryTable({
  logs,
  isLoading,
}: PointHistoryTableProps) {
  return (
    <section
      aria-labelledby="point-history-title"
      aria-busy={isLoading}
      className="mt-6 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white"
    >
      <header className="flex items-center justify-between border-b border-[#E4E7EC] px-6 py-5">
        <h2
          id="point-history-title"
          className="text-[20px] font-bold text-[#111827]"
        >
          사용 내역
        </h2>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[24%]" />
            <col className="w-[20%]" />
            <col className="w-[22%]" />
            <col className="w-[34%]" />
          </colgroup>
          <thead className="border-b border-[#E4E7EC] bg-[#FCFCFD]">
            <tr>
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#667085]">
                일시
              </th>
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#667085]">
                유형
              </th>
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#667085]">
                금액
              </th>
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#667085]">
                사유
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4}>
                  <LoadingSpinner text="내역을 불러오는 중입니다..." />
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-[14px] text-[#667085]"
                >
                  마일리지 내역이 없습니다.
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <PointHistoryRow
                  key={
                    log.pointId ??
                    log.mileageId ??
                    `${log.userId}-${log.createdAt}-${index}`
                  }
                  log={log}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
