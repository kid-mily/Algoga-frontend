"use client";

import { QuizCardProps } from "../types";

export default function QuizCard({
  lectureTitle,
  question,
  options,
  answer,
  explanation,
  onEdit,
  onDelete,
}: QuizCardProps) {
  const labels = ["A", "B", "C", "D"];
  const headingId = `quiz-${lectureTitle}-${question}`.replace(/\s+/g, "-");

  return (
    <article
      aria-labelledby={headingId}
      className="rounded-[18px] border border-[#E4E7EC] bg-white p-4"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="inline-flex rounded-full bg-[#EAF7EE] px-2.5 py-1 text-[11px] font-semibold text-[#43A047]">
            {lectureTitle}
          </p>
          <h2
            id={headingId}
            className="mt-3 text-[18px] font-bold text-[#111827]"
          >
            {question}
          </h2>
        </div>

        <div
          className="flex shrink-0 items-center gap-3"
          aria-label="퀴즈 관리 버튼"
        >
          <button
            type="button"
            onClick={onEdit}
            aria-label="퀴즈 수정"
            className="transition hover:opacity-60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/edit.svg"
              alt="연필"
              aria-hidden="true"
              className="h-[18px] w-[18px]"
            />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="퀴즈 삭제"
            className="transition hover:opacity-60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/delete.svg"
              alt="쓰레기통"
              aria-hidden="true"
              className="h-[18px] w-[18px]"
            />
          </button>
        </div>
      </header>

      <ol className="mt-4 grid grid-cols-2 gap-3" aria-label="퀴즈 보기">
        {options.map((option, index) => {
          const isAnswer = option === answer;

          return (
            <li
              key={`${labels[index]}-${option}`}
              className={`flex items-center justify-between rounded-[14px] border px-4 py-3 ${
                isAnswer ? "border-[#6ACE7F] bg-[#F6FFF8]" : "border-[#E4E7EC]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-[26px] w-[26px] items-center justify-center rounded-full text-[12px] font-bold ${
                    isAnswer
                      ? "bg-[#6ACE7F] text-white"
                      : "bg-[#F2F4F7] text-[#667085]"
                  }`}
                >
                  {labels[index]}
                </span>
                <p className="text-[14px] font-medium text-[#111827]">
                  {option}
                </p>
              </div>

              {isAnswer && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/check.svg"
                    alt="정답"
                    className="h-[18px] w-[18px]"
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>

      {explanation && (
        <section
          className="mt-4 rounded-[14px] bg-[#EAF7EE] p-3"
          aria-label="퀴즈 해설"
        >
          <h3 className="text-[13px] font-semibold text-[#43A047]">해설</h3>
          <p className="mt-1 text-[14px] text-[#344054]">{explanation}</p>
        </section>
      )}
    </article>
  );
}
