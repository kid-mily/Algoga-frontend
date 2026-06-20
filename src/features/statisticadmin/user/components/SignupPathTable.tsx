import { SignupPathStatistic } from "../types";
import { formatNumber, formatPercent } from "../utils";

type SignupPathTableProps = {
  statistics: SignupPathStatistic[];
  isLoading: boolean;
  compact?: boolean;
};

const COLUMN_COUNT = 4;

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
  statistics,
  isLoading,
  compact = false,
}: SignupPathTableProps) {
  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white">
      <header className="border-b border-[#EEF0F3] px-6 py-4">
        <h2 className="text-[18px] font-bold text-[#111827]">
          {compact ? "상위 유입 경로" : "유입 경로별 상세 통계"}
        </h2>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[14px]">
          <thead className="bg-[#F9FAFB] text-[13px] text-[#667085]">
            <tr>
              <th className="px-5 py-3 font-semibold">유입 경로</th>
              <th className="px-5 py-3 font-semibold">가입 수</th>
              <th className="px-5 py-3 font-semibold">비율</th>
              <th className="px-5 py-3 font-semibold">그래프</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF0F3] text-[#344054]">
            {isLoading ? (
              <EmptyRow message="유입 경로 통계를 불러오는 중입니다..." />
            ) : statistics.length === 0 ? (
              <EmptyRow message="유입 경로 통계 데이터가 없습니다." />
            ) : (
              statistics.slice(0, compact ? 5 : statistics.length).map((statistic) => (
                <tr key={`${statistic.signupPath}-${statistic.label}`}>
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
                  <td className="px-5 py-4 font-semibold text-[#439A97]">
                    {formatPercent(statistic.ratio)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-[8px] w-full min-w-[120px] overflow-hidden rounded-full bg-[#F2F4F7]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: statistic.ratio
                            ? `${Math.max(2, Math.min(100, statistic.ratio))}%`
                            : "0%",
                          backgroundColor: statistic.color,
                        }}
                      />
                    </div>
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
