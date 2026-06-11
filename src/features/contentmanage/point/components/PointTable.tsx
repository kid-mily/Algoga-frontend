import LoadingSpinner from "@/features/common/LoadingSpinner";
import { StudentPointInfo } from "../types";
import PointRow from "./PointRow";

interface PointTableProps {
  students: StudentPointInfo[];
  isLoading: boolean;
  onDetail: (studentId: number) => void;
  onGive: (student: StudentPointInfo) => void;
  onRecall: (student: StudentPointInfo) => void;
}

export default function PointTable({
  students,
  isLoading,
  onDetail,
  onGive,
  onRecall,
}: PointTableProps) {
  return (
    <section
      aria-labelledby="point-list-title"
      aria-busy={isLoading}
      className="mt-5 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white"
    >
      <h2 id="point-list-title" className="sr-only">
        사용자 마일리지 목록
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[42%]" />
            <col className="w-[22%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
          </colgroup>
          <thead className="border-b border-[#E4E7EC] bg-[#FCFCFD]">
            <tr>
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#667085]">
                사용자
              </th>
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#667085]">
                보유 마일리지
              </th>
              <th className="px-6 py-4 text-left text-[14px] font-semibold text-[#667085]">
                상세 정보
              </th>
              <th className="px-6 py-4 text-center text-[14px] font-semibold text-[#667085]">
                액션
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4}>
                  <LoadingSpinner text="학생 정보를 불러오는 중입니다..." />
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-[14px] text-[#667085]"
                >
                  마일리지 정보를 가진 사용자가 없습니다.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <PointRow
                  key={student.userId}
                  student={student}
                  onDetail={onDetail}
                  onGive={onGive}
                  onRecall={onRecall}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
