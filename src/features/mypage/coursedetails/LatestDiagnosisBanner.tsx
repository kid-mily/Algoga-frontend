import type { LatestDiagnosisResult } from "./types";

interface LatestDiagnosisBannerProps {
  diagnoses: LatestDiagnosisResult[];
}

export default function LatestDiagnosisBanner({
  diagnoses,
}: LatestDiagnosisBannerProps) {
  if (diagnoses.length === 0) {
    return (
      <section className="rounded-lg border border-[#DCE9E7] bg-[#EFF7F6] px-6 py-5">
        <p className="text-xs font-bold text-[#439A97]">
          나에게 맞는 여행 학습 찾기
        </p>

        <h2 className="mt-1 text-lg font-bold text-[#0A1628]">
          아직 진단평가 결과가 없습니다
        </h2>

        <p className="mt-2 text-sm text-[#667085]">
          관심 국가 진단평가를 통해 맞춤 강의를 추천받아 보세요.
        </p>
      </section>
    );
  }

    return (
        <section className="rounded-lg border border-[#DCE9E7] bg-white p-5 shadow-sm">
            <div className="mb-4">
                <p className="text-xs font-bold text-[#439A97]">
                나라별 최신 진단평가
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#0A1628]">
                최근 진단 결과
                </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                {diagnoses.map((diagnosis) => (
                <article
                    key={diagnosis.resultId}
                    className="rounded-lg border border-[#E6ECF2] bg-[#F8FBFB] p-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h3 className="font-bold text-[#0A1628]">
                            {diagnosis.countryName}
                            </h3>

                            <p className="mt-1 text-sm text-[#667085]">
                            {diagnosis.totalCount}문제 중 {diagnosis.correctCount}문제 정답
                            </p>
                        </div>

                        <div className="text-right">
                            <span className="rounded-full bg-[#EAF7F6] px-3 py-1 text-xs font-bold text-[#357A78]">
                            {diagnosis.levelName}
                            </span>

                            <strong className="mt-2 block text-xl text-[#439A97]">
                            {diagnosis.score}점
                            </strong>
                        </div>
                    </div>
                </article>
                ))}
            </div>
        </section>
    );
}