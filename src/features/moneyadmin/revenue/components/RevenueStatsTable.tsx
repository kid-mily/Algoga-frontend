import Link from "next/link";
import { MonthlyRevenueStat } from "../types";
import { formatGrowthRate, formatMonthLabel, formatWon } from "../utils";

type RevenueStatsTableProps = {
  stats: MonthlyRevenueStat[];
  isLoading: boolean;
};

export default function RevenueStatsTable({
  stats,
  isLoading,
}: RevenueStatsTableProps) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
            <th className="w-[150px] px-5 py-4">기간</th>
            <th className="w-[150px] px-5 py-4">결제 건수</th>
            <th className="px-5 py-4">총 매출</th>
            <th className="px-5 py-4">환불 금액</th>
            <th className="px-5 py-4">순 수익</th>
            <th className="w-[130px] px-5 py-4">성장률</th>
            <th className="w-[120px] px-5 py-4">상세</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <EmptyRow text="월별 수익 통계를 불러오는 중입니다..." />
          ) : stats.length > 0 ? (
            stats.map((stat) => (
              <tr
                key={`${stat.year}-${stat.month}`}
                className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0"
              >
                <td className="px-5 py-5 font-bold text-[#111827]">
                  {formatMonthLabel(stat.year, stat.month)}
                </td>
                <td className="px-5 py-5">{stat.count.toLocaleString()}건</td>
                <td className="px-5 py-5 font-bold text-[#111827]">
                  {formatWon(stat.totalAmount)}
                </td>
                <td className="px-5 py-5 font-semibold text-[#DC2626]">
                  {formatWon(stat.refundAmount)}
                </td>
                <td className="px-5 py-5 font-bold text-[#16A34A]">
                  {formatWon(stat.netAmount)}
                </td>
                <td
                  className={`px-5 py-5 font-semibold ${
                    stat.growthRate >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"
                  }`}
                >
                  {formatGrowthRate(stat.growthRate)}
                </td>
                <td className="px-5 py-5">
                  <Link
                    href={`/moneyadmin/revenue/${stat.year}/${stat.month}`}
                    className="inline-flex h-[34px] items-center rounded-[8px] border border-[#D0D5DD] px-3 text-[13px] font-semibold text-[#344054]"
                  >
                    상세 보기
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <EmptyRow text="조회된 월별 수익 통계가 없습니다." />
          )}
        </tbody>
      </table>
    </section>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <tr>
      <td
        colSpan={7}
        role="status"
        aria-live="polite"
        className="px-6 py-12 text-center text-[14px] text-[#667085]"
      >
        {text}
      </td>
    </tr>
  );
}
