import Image from "next/image";
import type { DiagnosisResult, EvaluationFormQuestion } from "../types";
import { LEVEL_STYLES } from "../utils/evaluationResult.util";

interface EvaluationResultHeroProps {
    result: DiagnosisResult;
    questions: EvaluationFormQuestion[];
}

export default function EvaluationResultHero({ result, questions }: EvaluationResultHeroProps) {
    const levelStyle = LEVEL_STYLES[result.level] ?? LEVEL_STYLES.BEGINNER;

    return (
        <section className="overflow-hidden rounded-[32px] border border-[#D7E3EA] bg-white shadow-[0_18px_45px_rgba(52,79,98,0.12)]">
        <div className="grid md:grid-cols-[1fr_260px]">
            <div className="px-6 py-7 sm:px-9">
            <span className="rounded-full bg-[#EAF7F6] px-3 py-1 text-[11px] font-extrabold tracking-[0.14em] text-[#357A78]">
                ALGO BOARDING PASS
            </span>

            <h1 className="mt-5 text-2xl font-extrabold text-[#0A1628] sm:text-3xl">
                진단 평가 완료!
            </h1>

            <p className="mt-2 text-sm font-medium text-[#7C8A9A]">
                나에게 맞는 강의를 추천해드릴게요.
            </p>
            </div>

            <div className="flex min-h-[180px] items-center justify-center border-t border-[#E1EAF0] bg-[#F8FBFC] px-6 py-6 md:border-l md:border-t-0">
            <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Image
                    src="/images/medal.svg"
                    alt="진단 평가 완료"
                    width={32}
                    height={32}
                />
                </div>

                <p className="mt-3 text-[11px] font-extrabold tracking-[0.14em] text-[#98A2B3]">
                ALGOGA
                </p>

                <p className="mt-1 text-xs font-bold text-[#439A97]">
                알고 가는 여행
                </p>
            </div>
            </div>
        </div>

        <div className="relative border-t border-dashed border-[#D7E3EA]">
            <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-[#F4F7FB]" />
            <span className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-[#F4F7FB]" />
        </div>

        <div className="grid md:grid-cols-[1fr_260px]">
            <div className="flex min-h-[180px] items-center px-6 py-7 sm:px-9">
            <div>
                <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#98A2B3]">
                BOARDING INFO
                </p>

                <h2 className="mt-2 text-lg font-extrabold text-[#0A1628]">
                여행 학습 준비가 완료되었습니다
                </h2>

                <p className="mt-2 text-sm font-medium text-[#7C8A9A]">
                추천 강의에서 다음 여정을 시작해보세요.
                </p>

                {questions.length > 0 ? (
                <p className="mt-3 text-xs font-semibold text-[#98A2B3]">
                    진단 문항 {questions.length}개 완료
                </p>
                ) : null}
            </div>
            </div>

            <div
            className={`flex min-h-[180px] items-center justify-center border-t px-6 py-7 text-center md:border-l md:border-t-0 ${levelStyle.background} ${levelStyle.border}`}
            >
            <div>
                <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#98A2B3]">
                YOUR LEVEL
                </p>

                <strong
                className={`mt-4 block text-4xl font-extrabold ${levelStyle.text}`}
                >
                {result.levelName || levelStyle.label}
                </strong>

                <p
                className={`mx-auto mt-4 inline-flex rounded-full border px-4 py-1.5 text-xs font-bold ${levelStyle.border} ${levelStyle.text}`}
                >
                {result.levelName || levelStyle.label} 강의 추천
                </p>
            </div>
            </div>
        </div>
        </section>
    );
}