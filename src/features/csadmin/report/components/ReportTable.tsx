import { AdminReport } from "@/features/csadmin/report/types";
import ReportRow from "./ReportRow";

type ReportTableProps = {
  reports: AdminReport[];
  isLoading: boolean;
};

export default function ReportTable({ reports, isLoading }: ReportTableProps) {
  return (
    <section
      className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white"
      aria-labelledby="report-table-title"
    >
      <h2 id="report-table-title" className="sr-only">
        신고 내역 목록
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] table-auto border-collapse">
          <thead>
            <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
              <th scope="col" className="w-[100px] px-4 py-4">신고 ID</th>
              <th scope="col" className="w-[140px] px-4 py-4">대상</th>
              <th scope="col" className="w-[150px] px-4 py-4">신고자</th>
              <th scope="col" className="px-4 py-4">신고 사유</th>
              <th scope="col" className="w-[150px] px-4 py-4">접수일</th>
              <th scope="col" className="w-[120px] px-4 py-4">상태</th>
              <th scope="col" className="w-[120px] px-4 py-4">관리</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-[14px] text-[#667085]">
                  신고 내역을 불러오는 중입니다...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-[14px] text-[#667085]">
                  신고 내역이 없습니다.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <ReportRow key={report.reportId} report={report} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
