import type { EvaluationFormQuestion } from "./types";
import SubHeader from "@/features/common/components/SubHeader";

interface EvaluationHeaderProps {
  continentCode: string;
  countryId: string;
  questions: EvaluationFormQuestion[];
  currentStep: number;
  progress: number;
}

export default function EvaluationHeader({
  continentCode,
  countryId,
  questions,
  currentStep,
  progress,
}: EvaluationHeaderProps) {
  return (
    <header>
      {/* 강의실로 돌아가기 */}
      <SubHeader
            backHref={`/classroom/${continentCode}/${countryId}`} 
            backText="강의 목록으로 돌아가기"
            title=""
            description=""
          />

      <article className="mt-3 rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          {/* 진단평가 제목 */}
          <div>
            <h1 className="text-xl font-bold text-[#0A1628]">
              여행 진단평가
            </h1>

            <p className="mt-3 text-sm font-medium text-[#8A94A6]">
              나에게 맞는 강의를 추천받아보세요.
            </p>
          </div>
        </div>

        <div className="border border-dashed border-gray-100 mt-5"></div>

        {/* 진행률 영역 */}
        <section
          className="mt-5"
          aria-labelledby="evaluation-progress"
        >
          <div className="flex items-center justify-between">
            <h2
              className="text-xl font-bold text-[#0A1628]"
            >
              문제 {currentStep + 1} / {questions.length}
            </h2>

            <span className="font-semibold text-[#8A94A6]">
              {progress}% 완료
            </span>
          </div>

          {/* 진행률 막대 */}
          <div
            className="mt-3 h-3 w-full rounded-full bg-[#E8EEF5]"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-[#439A97]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 문제 번호 목록 */}
          <ol
            className="mt-5 flex flex-wrap gap-3"
            aria-label="문제 진행 상태"
          >
            {questions.map((question, index) => {
              const isCurrentQuestion = currentStep === index;

              return (
                <li key={question.questionId}>
                  <span
                    className={`flex h-8 w-12 items-center justify-center rounded-xl border text-sm font-bold ${
                      isCurrentQuestion
                        ? "border-[#439A97] text-[#439A97]"
                        : "border-[#E8EEF5] text-[#B0BEC5]"
                    }`}
                  >
                    {index + 1}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </article>
    </header>
  );
}