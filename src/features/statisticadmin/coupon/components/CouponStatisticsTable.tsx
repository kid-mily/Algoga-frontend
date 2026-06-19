import { CouponStatistic } from "../types";
import { formatDiscount, formatPercent } from "../utils";

type CouponStatisticsTableProps = {
  statistics: CouponStatistic[];
  isLoading: boolean;
};

export default function CouponStatisticsTable({
  statistics,
  isLoading,
}: CouponStatisticsTableProps) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
            <th className="w-[120px] px-5 py-4">쿠폰 ID</th>
            <th className="px-5 py-4">쿠폰명</th>
            <th className="w-[120px] px-5 py-4">국가</th>
            <th className="px-5 py-4">연결 강의</th>
            <th className="w-[110px] px-5 py-4">할인</th>
            <th className="w-[110px] px-5 py-4">발급</th>
            <th className="w-[110px] px-5 py-4">사용</th>
            <th className="w-[110px] px-5 py-4">만료</th>
            <th className="w-[110px] px-5 py-4">사용 가능</th>
            <th className="w-[120px] px-5 py-4">사용률</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <EmptyRow text="쿠폰 통계를 불러오는 중입니다..." />
          ) : statistics.length > 0 ? (
            statistics.map((statistic) => (
              <tr
                key={statistic.couponPolicyId}
                className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0"
              >
                <td className="px-5 py-4 font-semibold text-[#111827]">
                  #{statistic.couponPolicyId}
                </td>
                <td className="px-5 py-4 font-bold text-[#111827]">
                  {statistic.couponName}
                </td>
                <td className="px-5 py-4">{statistic.countryName}</td>
                <td className="px-5 py-4">{statistic.courseName}</td>
                <td className="px-5 py-4 font-semibold text-[#111827]">
                  {formatDiscount(statistic.discountType, statistic.discountValue)}
                </td>
                <td className="px-5 py-4">{statistic.issuedCount.toLocaleString()}건</td>
                <td className="px-5 py-4 font-semibold text-[#439A97]">
                  {statistic.usedCount.toLocaleString()}건
                </td>
                <td className="px-5 py-4 text-[#DC2626]">
                  {statistic.expiredCount.toLocaleString()}건
                </td>
                <td className="px-5 py-4">
                  {statistic.availableCount.toLocaleString()}건
                </td>
                <td className="px-5 py-4">{formatPercent(statistic.usageRate)}</td>
              </tr>
            ))
          ) : (
            <EmptyRow text="조회된 쿠폰 통계가 없습니다." />
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
        colSpan={10}
        role="status"
        aria-live="polite"
        className="px-6 py-12 text-center text-[14px] text-[#667085]"
      >
        {text}
      </td>
    </tr>
  );
}
