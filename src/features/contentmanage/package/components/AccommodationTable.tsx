import LoadingSpinner from "@/features/common/LoadingSpinner";
import { Accommodation } from "../types";
import AccommodationRow from "./AccommodationRow";

interface AccommodationTableProps {
  accommodations: Accommodation[];
  isLoading: boolean;
  onEdit: (accommodationId: number) => void;
  onDelete: (accommodation: Accommodation) => void;
}

export default function AccommodationTable({
  accommodations,
  isLoading,
  onEdit,
  onDelete,
}: AccommodationTableProps) {
  return (
    <section
      aria-labelledby="accommodation-list-title"
      aria-busy={isLoading}
      className="mt-5 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white"
    >
      <header className="border-b border-[#E4E7EC] px-5 py-4">
        <h2 id="accommodation-list-title" className="text-[18px] font-bold text-[#111827]">
          숙소 목록
        </h2>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[28%]" />
            <col className="w-[14%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[6%]" />
          </colgroup>
          <thead className="border-b border-[#E4E7EC] bg-[#FCFCFD]">
            <tr>
              <th scope="col" className="px-5 py-4 text-left text-[13px] font-semibold text-[#667085]">숙소</th>
              <th scope="col" className="px-5 py-4 text-left text-[13px] font-semibold text-[#667085]">설명</th>
              <th scope="col" className="px-5 py-4 text-left text-[13px] font-semibold text-[#667085]">1박 가격</th>
              <th scope="col" className="px-5 py-4 text-left text-[13px] font-semibold text-[#667085]">숙박일수</th>
              <th scope="col" className="px-5 py-4 text-left text-[13px] font-semibold text-[#667085]">숙소 가격</th>
              <th scope="col" className="px-5 py-4 text-center text-[13px] font-semibold text-[#667085]">관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6}>
                  <LoadingSpinner text="숙소 목록을 불러오는 중입니다..." />
                </td>
              </tr>
            ) : accommodations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[14px] text-[#667085]">
                  선택한 국가에 등록된 숙소가 없습니다.
                </td>
              </tr>
            ) : (
              accommodations.map((accommodation) => (
                <AccommodationRow
                  key={accommodation.accommodationId}
                  accommodation={accommodation}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
