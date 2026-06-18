import { MileageHistory } from "./types";

interface MileageHistoryTableProps {
  histories: MileageHistory[];
}

function formatNumber(value?: number) {
  return (value ?? 0).toLocaleString("ko-KR");
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "-";

  return dateString.split("T")[0].replaceAll("-", ".");
}

export function MileageHistoryTable({ histories }: MileageHistoryTableProps) {
  const recentHistories = histories.slice(0, 3);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
        <h2 className="text-lg font-bold text-gray-900">사용 내역</h2>
      </header>

      {recentHistories.length === 0 ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-sm text-gray-400">
            마일리지 내역이 없습니다.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left font-medium">일시</th>
                <th className="px-6 py-4 text-left font-medium">유형</th>
                <th className="px-6 py-4 text-right font-medium">금액</th>
                <th className="px-6 py-4 text-right font-medium">사유</th>
              </tr>
            </thead>

            <tbody>
              {recentHistories.map((history) => (
                <MileageHistoryRow
                  key={history.mileageHistoryId}
                  history={history}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

interface MileageHistoryRowProps {
  history: MileageHistory;
}

function MileageHistoryRow({ history }: MileageHistoryRowProps) {
  const isEarned = history.type === "EARN";

  return (
    <tr className="border-t border-gray-100">
      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
        {formatDate(history.createdAt)}
      </td>

      <td
        className={`px-6 py-4 font-semibold ${
          isEarned ? "text-green-600" : "text-red-500"
        }`}
      >
        {isEarned ? "적립" : "사용"}
      </td>

      <td
        className={`whitespace-nowrap px-6 py-4 text-right font-bold ${
          isEarned ? "text-green-600" : "text-red-500"
        }`}
      >
        {isEarned ? "+" : "-"}
        {formatNumber(Math.abs(history.amount))}M
      </td>

      <td className="max-w-60 truncate px-6 py-4 text-right text-gray-600">
        {history.reason || "-"}
      </td>
    </tr>
  );
}