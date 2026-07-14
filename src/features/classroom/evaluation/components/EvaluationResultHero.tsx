import Image from "next/image";
import { DiagnosisResult } from "../types";
import { LEVEL_STYLES } from "../utils/evaluationResult.util";

interface EvaluationResultHeroProps {
  result: DiagnosisResult;
}

export default function EvaluationResultHero({ result }: EvaluationResultHeroProps) {
  const levelStyle = LEVEL_STYLES[result.level] ?? LEVEL_STYLES.BEGINNER;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#D7E3EA] bg-white shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
      <div className="grid md:grid-cols-[1fr_200px]">
        <div className="px-5 py-5 sm:px-7">
          <span className="rounded-full bg-[#EAF7F6] px-3 py-1 text-[11px] font-extrabold tracking-[0.14em] text-[#357A78]">
            ALGO BOARDING PASS
          </span>

          <h1 className="mt-3 text-xl font-extrabold text-[#0A1628] sm:text-2xl">
            진단평가 완료!
          </h1>

          <p className="mt-1.5 text-sm font-medium text-[#7C8A9A]">
            {result.countryName} 학습을 위한 맞춤 강의를 추천해드릴게요.
          </p>
        </div>

        <div className="flex min-h-[110px] items-center justify-center border-t border-[#E1EAF0] bg-[#F8FBFC] px-5 py-4 md:border-l md:border-t-0">
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              <Image
                src="/images/medal.svg"
                alt="진단평가 완료"
                width={22}
                height={22}
              />
            </div>

            <p className="mt-2 text-[10px] font-extrabold tracking-[0.14em] text-[#98A2B3]">
              SCORE
            </p>

            <p className="mt-0.5 text-xl font-extrabold text-[#439A97]">
              {result.score}점
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-[#D7E3EA]" />

      <div className="grid md:grid-cols-[1fr_200px]">
        <div className="flex min-h-[110px] items-center px-5 py-5 sm:px-7">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.14em] text-[#98A2B3]">
              BOARDING INFO
            </p>

            <h2 className="mt-1.5 text-base font-extrabold text-[#0A1628]">
              여행 학습 준비가 완료되었습니다
            </h2>

            <p className="mt-1.5 text-sm font-medium text-[#7C8A9A]">
              {result.totalCount}문제 중 {result.correctCount}문제를 맞혔어요.
            </p>

            <p className="mt-2 text-xs font-semibold text-[#98A2B3]">
              제출일 {result.submittedAt.replace("T", " ").slice(0, 16)}
            </p>
          </div>
        </div>

        <div
          className={`flex min-h-[110px] items-center justify-center border-t px-5 py-5 text-center md:border-l md:border-t-0 ${levelStyle.background} ${levelStyle.border}`}
        >
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-[#98A2B3]">
              YOUR LEVEL
            </p>

            <strong
              className={`mt-2 block text-2xl font-extrabold ${levelStyle.text}`}
            >
              {result.levelName || levelStyle.label}
            </strong>

            <p
              className={`mx-auto mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${levelStyle.border} ${levelStyle.text}`}
            >
              {result.levelName || levelStyle.label} 강의 추천
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}