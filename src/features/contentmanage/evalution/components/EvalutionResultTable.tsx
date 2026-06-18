import { EvalutionResult } from "../types";

type EvalutionResultTableProps = {
  results: EvalutionResult[];
  isLoading: boolean;
};

export default function EvalutionResultTable({
  results,
  isLoading,
}: EvalutionResultTableProps) {
  return (
    <section aria-labelledby="evalution-result-title">
      <h2 id="evalution-result-title" className="sr-only">
        진단평가 결과 목록
      </h2>

      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
            <th className="w-[120px] px-5 py-4">결과 ID</th>
            <th className="w-[160px] px-5 py-4">사용자</th>
            <th className="w-[120px] px-5 py-4">회원 ID</th>
            <th className="w-[120px] px-5 py-4">진단 등급</th>
            <th className="w-[120px] px-5 py-4">점수</th>
            <th className="px-5 py-4">응시일</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <EmptyRow text="진단평가 결과를 불러오는 중입니다..." />
          ) : results.length > 0 ? (
            results.map((result) => (
              <tr
                key={result.resultId}
                className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0"
              >
                <td className="px-5 py-4 font-semibold text-[#111827]">
                  #{result.resultId}
                </td>
                <td className="px-5 py-4">{result.userName}</td>
                <td className="px-5 py-4">{result.userId}</td>
                <td className="px-5 py-4 font-semibold text-[#439A97]">
                  {result.level}
                </td>
                <td className="px-5 py-4">{result.score.toLocaleString()}점</td>
                <td className="px-5 py-4 text-[#667085]">{result.submittedAt}</td>
              </tr>
            ))
          ) : (
            <EmptyRow text="조회된 진단평가 결과가 없습니다." />
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
        colSpan={6}
        role="status"
        aria-live="polite"
        className="px-6 py-12 text-center text-[14px] text-[#667085]"
      >
        {text}
      </td>
    </tr>
  );
}
