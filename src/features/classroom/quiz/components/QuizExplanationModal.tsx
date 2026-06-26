"use client";

import type { CourseQuizAttempt } from "../types";

interface QuizExplanationModalProps {
  open: boolean;
  attempt: CourseQuizAttempt | null;
  onClose: () => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"] as const;

export default function QuizExplanationModal({
  open,
  attempt,
  onClose,
}: QuizExplanationModalProps) {
  if (!open || !attempt) return null;

  const answers = attempt.result.answers ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-explanation-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="flex max-h-[80dvh] w-full max-w-[720px] flex-col overflow-hidden rounded-[24px] bg-white shadow-xl">
        <header className="flex shrink-0 items-start justify-between border-b border-[#E8EEF5] px-6 py-5">
          <div>
            <h2
              id="quiz-explanation-title"
              className="text-xl font-bold text-[#0A1628]"
            >
              퀴즈 해설
            </h2>

            <p className="mt-1 text-sm text-[#8A9BB0]">
              내가 선택한 답과 정답을 비교해 보세요.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="해설 닫기"
            className="text-2xl text-[#98A2B3]"
          >
            ×
          </button>
        </header>

        <div className="overflow-y-auto px-6 py-5">
          {answers.length === 0 ? (
            <p className="rounded-[16px] bg-[#F5F7FB] px-4 py-8 text-center text-sm text-[#8A9BB0]">
              해설 정보가 없습니다.
            </p>
          ) : (
            <ol className="space-y-4">
              {answers.map((answer, index) => {
                const options = [
                  answer.option1,
                  answer.option2,
                  answer.option3,
                  answer.option4,
                ];

                return (
                  <li
                    key={answer.answerId || answer.quizId}
                    className="rounded-[18px] border border-[#E4EAF1] bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-[#5E9F9B]">
                          문제 {index + 1}
                        </span>

                        <h3 className="mt-1.5 font-bold leading-6 text-[#0A1628]">
                          {answer.question}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                          answer.correct
                            ? "bg-[#EFFAF2] text-[#367C47]"
                            : "bg-[#FFF1F1] text-[#C84444]"
                        }`}
                      >
                        {answer.correct ? "정답" : "오답"}
                      </span>
                    </div>

                    <dl className="mt-4 space-y-2 text-sm">
                      <div
                        className={`rounded-[12px] px-4 py-3 ${
                          answer.correct ? "bg-[#EFFAF2]" : "bg-[#FFF1F1]"
                        }`}
                      >
                        <dt className="text-xs font-bold text-[#8A9BB0]">
                          내가 선택한 답
                        </dt>

                        <dd
                          className={`mt-1 font-bold ${
                            answer.correct ? "text-[#367C47]" : "text-[#C84444]"
                          }`}
                        >
                          {OPTION_LABELS[answer.selectedOption - 1]}.{" "}
                          {answer.selectedAnswer ||
                            options[answer.selectedOption - 1]}
                        </dd>
                      </div>

                      {!answer.correct ? (
                        <div className="rounded-[12px] bg-[#EFFAF2] px-4 py-3">
                          <dt className="text-xs font-bold text-[#8A9BB0]">
                            정답
                          </dt>

                          <dd className="mt-1 font-bold text-[#367C47]">
                            {OPTION_LABELS[answer.correctOption - 1]}.{" "}
                            {answer.correctAnswer ||
                              options[answer.correctOption - 1]}
                          </dd>
                        </div>
                      ) : null}
                    </dl>

                    {answer.explanation ? (
                      <div className="mt-3 rounded-[12px] bg-[#F5F7FB] px-4 py-3 text-left">
                        <strong className="text-xs text-[#667085]">
                          해설
                        </strong>

                        <p className="mt-1 text-sm leading-6 text-[#475467]">
                          {answer.explanation}
                        </p>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <footer className="shrink-0 border-t border-[#E8EEF5] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full rounded-[16px] bg-[#5E9F9B] text-sm font-bold text-white"
          >
            확인
          </button>
        </footer>
      </section>
    </div>
  );
}