import { Download } from "lucide-react";
import type { CountryLectureConversion } from "../types";
import { evaluationBadgeClassName, formatPeople, formatPercent } from "../utils";

type LectureCountryConversionTableProps = {
  data: CountryLectureConversion[];
  onDownloadCsv: () => void;
};

export default function LectureCountryConversionTable({
  data,
  onDownloadCsv,
}: LectureCountryConversionTableProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-[18px] border border-[#EAECF0] bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-[#EEF2F6] px-6 py-5">
        <h2 className="text-[17px] font-bold text-[#111827]">
          나라별 강의 → 여행 전환율
        </h2>

        <button
          type="button"
          onClick={onDownloadCsv}
          className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E4E7EC] px-3 text-[12px] font-semibold text-[#667085]"
        >
          <Download size={14} />
          CSV
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] text-left text-[13px] font-bold text-[#667085]">
              <th className="px-6 py-4">여행지 국가</th>
              <th className="px-6 py-4">강의 구매자 수</th>
              <th className="px-6 py-4">완강자</th>
              <th className="px-6 py-4">패키지 전환자 수</th>
              <th className="px-6 py-4">전환율</th>
              <th className="px-6 py-4">평가</th>
            </tr>
          </thead>
          <tbody>
            {data.map((country) => (
              <tr
                key={country.country}
                className="border-t border-[#EEF2F6] text-[14px] text-[#344054]"
              >
                <td className="px-6 py-4 font-bold text-[#111827]">
                  {country.country}
                </td>
                <td className="px-6 py-4 text-[#98A2B3]">
                  {formatPeople(country.lectureBuyers)}
                </td>
                <td className="px-6 py-4 text-[#98A2B3]">
                  {formatPeople(country.completedUsers)}
                </td>
                <td className="px-6 py-4 font-bold text-[#2FAE9B]">
                  {formatPeople(country.reservationUsers)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex min-w-[260px] items-center gap-4">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEF2F6]">
                      <div
                        className="h-full rounded-full bg-[#2FAE9B]"
                        style={{
                          width: `${Math.min(country.conversionRate * 3, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="w-12 text-[13px] font-bold text-[#2FAE9B]">
                      {formatPercent(country.conversionRate)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${evaluationBadgeClassName[country.evaluation]}`}
                  >
                    {country.evaluation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
