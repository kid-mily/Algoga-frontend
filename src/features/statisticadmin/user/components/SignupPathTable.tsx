import { SignupPathChannelRevenue } from "../types";
import { formatNumber, formatPercent, formatWon } from "../utils";

type SignupPathTableProps = {
  channelRevenue: SignupPathChannelRevenue[];
  isLoading: boolean;
};

const COLUMN_COUNT = 5;

function EmptyRow({ message }: { message: string }) {
  return (
    <tr>
      <td
        colSpan={COLUMN_COUNT}
        role="status"
        aria-live="polite"
        className="px-5 py-12 text-center text-[14px] text-[#667085]"
      >
        {message}
      </td>
    </tr>
  );
}

export default function SignupPathTable({
  channelRevenue,
  isLoading,
}: SignupPathTableProps) {
  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="border-b border-[#EEF0F3] px-6 py-4">
        <h2 className="text-[18px] font-bold text-[#111827]">
          유저 경로별 상세통계
        </h2>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[14px]">
          <thead className="bg-[#F9FAFB] text-[13px] text-[#667085]">
            <tr>
              <th className="px-5 py-3 font-semibold">유입 경로</th>
              <th className="px-5 py-3 font-semibold">회원가입 수</th>
              <th className="px-5 py-3 font-semibold">순매출</th>
              <th className="px-5 py-3 font-semibold">예약 수</th>
              <th className="px-5 py-3 font-semibold">예약 전환율</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF0F3] text-[#344054]">
            {isLoading ? (
              <EmptyRow message="유입 경로 통계를 불러오는 중입니다..." />
            ) : channelRevenue.length === 0 ? (
              <EmptyRow message="유입 경로 통계 데이터가 없습니다." />
            ) : (
              channelRevenue.map((statistic) => (
                <tr key={statistic.signupPath}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-[9px] w-[9px] rounded-full"
                        style={{ backgroundColor: statistic.color }}
                      />
                      <span className="font-bold text-[#111827]">
                        {statistic.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {formatNumber(statistic.signupCount)}명
                  </td>
                  <td className="px-5 py-4">{formatWon(statistic.netSales)}</td>
                  <td className="px-5 py-4">
                    {formatNumber(statistic.bookingCount)}건
                  </td>
                  <td className="px-5 py-4">
                    {formatPercent(statistic.bookingConversionRate)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
