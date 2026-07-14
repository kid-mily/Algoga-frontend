import { useState } from "react";
import { Download, Search } from "lucide-react";
import type { OutstandingReservation } from "../types";
import { formatWon, getDDayClassName, getDDayLabel } from "../utils";

type OutstandingReservationTableProps = {
  data: OutstandingReservation[];
  onDownloadCsv: () => Promise<void>;
};

export default function OutstandingReservationTable({
  data,
  onDownloadCsv,
}: OutstandingReservationTableProps) {
  const [keyword, setKeyword] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredData = data.filter((reservation) => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return true;

    return (
      reservation.customerName.toLowerCase().includes(normalizedKeyword) ||
      reservation.productName.toLowerCase().includes(normalizedKeyword)
    );
  });

  const handleDownloadCsv = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      await onDownloadCsv();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-[18px] bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-[#EEF0F3] px-5 py-4">
        <h3 className="text-[17px] font-bold text-[#111827]">
          미납 예약 목록
        </h3>

        <div className="flex items-center gap-2">
          <label className="flex h-9 w-[220px] items-center rounded-[10px] border border-[#E4E7EC] px-3">
            <Search size={14} className="text-[#98A2B3]" />
            <span className="sr-only">고객명 상품명 검색</span>
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="고객명·상품명 검색"
              className="ml-2 w-full bg-transparent text-[12px] outline-none placeholder:text-[#98A2B3]"
            />
          </label>

          <button
            type="button"
            onClick={() => void handleDownloadCsv()}
            disabled={isDownloading}
            className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E4E7EC] px-3 text-[12px] font-semibold text-[#667085] disabled:opacity-60"
          >
            <Download size={14} />
            {isDownloading ? "다운로드 중..." : "CSV"}
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] table-fixed border-collapse">
          <thead className="bg-[#F7F8FA]">
            <tr className="text-left text-[12px] font-semibold text-[#667085]">
              <th className="w-[15%] px-5 py-3">예약번호</th>
              <th className="w-[14%] px-5 py-3">고객명</th>
              <th className="w-[22%] px-5 py-3">상품명</th>
              <th className="w-[14%] px-5 py-3">잔금액</th>
              <th className="w-[14%] px-5 py-3">계약금 납부일</th>
              <th className="w-[10%] px-5 py-3">경과일</th>
              <th className="w-[14%] px-5 py-3">체크인일</th>
              <th className="w-[10%] px-5 py-3">D-day</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((reservation) => (
                <tr
                  key={reservation.bookingNumber}
                  className="border-b border-[#EEF0F3] text-[13px] text-[#344054]"
                >
                  <td className="px-5 py-4 text-[#667085]">
                    {reservation.bookingNumber}
                  </td>
                  <td className="px-5 py-4 font-bold text-[#111827]">
                    {reservation.customerName}
                  </td>
                  <td className="px-5 py-4 text-[#667085]">
                    {reservation.productName}
                  </td>
                  <td className="px-5 py-4 font-bold text-[#F59E0B]">
                    {formatWon(reservation.outstandingAmount)}
                  </td>
                  <td className="px-5 py-4 text-[#667085]">
                    {reservation.contractDate}
                  </td>
                  <td className="px-5 py-4 text-[#667085]">
                    {reservation.elapsedDays}일
                  </td>
                  <td className="px-5 py-4 text-[#667085]">
                    {reservation.checkInDate}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${getDDayClassName(
                        reservation.dDay
                      )}`}
                    >
                      {getDDayLabel(reservation.dDay)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-[13px] text-[#98A2B3]"
                >
                  미납 예약이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-between px-5 py-4 text-[12px] text-[#98A2B3]">
        <p>총 {filteredData.length}개</p>
      </footer>
    </article>
  );
}
