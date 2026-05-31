"use client";

interface QuizCardProps {
  lectureTitle: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function QuizCard({
  lectureTitle,
  question,
  options,
  answer,
  explanation,

  onView,
  onEdit,
  onDelete,
}: QuizCardProps) {

  const labels = [
    "A",
    "B",
    "C",
    "D",
  ];

  return (
    <div className="rounded-[18px] border border-[#E4E7EC] bg-white p-4">
      {/* 상단 */}
      <div className="flex items-start justify-between">
        {/* 왼쪽 */}
        <div>
          {/* 강의 */}
          <div className="inline-flex rounded-full bg-[#EAF7EE] px-2.5 py-1 text-[11px] font-semibold text-[#43A047]">
            {lectureTitle}
          </div>
          {/* 문제 */}
          <h2 className="mt-3 text-[18px] font-bold text-[#111827]">
            {question}
          </h2>
        </div>

        {/* 액션 */}
        <div className="flex items-center gap-4">
          {/* 보기 */}
          <button
            type="button"
            onClick={onView}
            className="transition hover:opacity-60"
          >
            <img
              src="/images/view.svg"
              alt="보기"
              className="h-[22px] w-[22px]"
            />
          </button>

          {/* 수정 */}
          <button
            type="button"
            onClick={onEdit}
            className="transition hover:opacity-60"
          >
            <img
              src="/images/edit.svg"
              alt="수정"
              className="h-[18px] w-[18px]"
            />
          </button>

          {/* 삭제 */}
          <button
            type="button"
            onClick={onDelete}
            className="transition hover:opacity-60"
          >
            <img
              src="/images/delete.svg"
              alt="삭제"
              className="h-[18px] w-[18px]"
            />
          </button>
        </div>
      </div>

      {/* 선택지 */}
      <div className="mt-4 grid grid-cols-2 gap-3">

        {options.map((option, index) => {

          const isAnswer =
            option === answer;

          return (
            <div
              key={option}
              className={`flex items-center justify-between rounded-[14px] border px-4 py-3 ${
                isAnswer
                  ? "border-[#6ACE7F] bg-[#F6FFF8]"
                  : "border-[#E4E7EC]"
              }`}
            >
              {/* 왼쪽 */}
              <div className="flex items-center gap-3">

                {/* 알파벳 */}
                <div
                  className={`flex h-[26px] w-[26px] items-center justify-center rounded-full text-[12px] font-bold ${
                    isAnswer
                      ? "bg-[#6ACE7F] text-white"
                      : "bg-[#F2F4F7] text-[#667085]"
                  }`}
                >
                  {labels[index]}
                </div>

                {/* 내용 */}
                <p className="text-[14px] font-medium text-[#111827]">
                  {option}
                </p>
              </div>

              {/* 체크 */}
              {isAnswer && (
                <img
                  src="/images/check.svg"
                  alt="정답"
                  className="h-[18px] w-[18px]"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 해설 */}
      {explanation && (
        <div className="mt-4 rounded-[14px] bg-[#EAF7EE] p-3">

          <p className="text-[13px] font-semibold text-[#43A047]">
            해설
          </p>

          <p className="mt-1 text-[14px] text-[#344054]">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}