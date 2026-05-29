"use client";

interface QnaItemProps {
  lecture: string;
  question: string;
  writer: string;
  createdAt: string;
  isAnswered: boolean;
  onView?: () => void;
  onAnswer?: () => void;
  onDelete?: () => void;
}

export default function QnaItem({
  lecture,
  question,
  writer,
  createdAt,
  isAnswered,

  onView,
  onAnswer,
  onDelete,
}: QnaItemProps) {

  return (
    <div className="grid grid-cols-[1.2fr_2fr_0.8fr_0.9fr_0.8fr_0.8fr] items-center border-b border-[#E4E7EC] px-5 py-5">

      {/* 강의 */}
      <div className="text-[15px] font-semibold text-[#111827]">
        {lecture}
      </div>

      {/* 질문 */}
      <div className="text-[15px] font-medium text-[#344054]">
        {question}
      </div>

      {/* 작성자 */}
      <div className="flex items-center gap-2">

        <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#EAF2FF]">

          <img
            src="/images/people.svg"
            alt="유저"
            className="h-[14px] w-[14px]"
          />
        </div>

        <span className="text-[14px] font-medium text-[#667085]">
          {writer}
        </span>
      </div>

      {/* 등록일 */}
      <div className="flex items-center gap-2 text-[14px] text-[#667085]">

        <img
          src="/images/calendar.svg"
          alt="달력"
          className="h-[15px] w-[15px]"
        />

        {createdAt}
      </div>

      {/* 상태 */}
      <div>

        <div
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold ${
            isAnswered
              ? "bg-[#EAF7EE] text-[#43A047]"
              : "bg-[#FFF4ED] text-[#F17B2C]"
          }`}
        >

          <div
            className={`h-[6px] w-[6px] rounded-full ${
              isAnswered
                ? "bg-[#43A047]"
                : "bg-[#F17B2C]"
            }`}
          />

          {isAnswered
            ? "답변 완료"
            : "답변 대기"}
        </div>
      </div>

      {/* 액션 */}
      <div className="flex items-center justify-center gap-4">

        {isAnswered ? (

          <>
            <button
              type="button"
              onClick={onView}
              className="text-[13px] font-semibold text-[#439A97] transition hover:opacity-70"
            >
              보기
            </button>
          </>

        ) : (

          <button
            type="button"
            onClick={onAnswer}
            className="text-[13px] font-semibold text-[#439A97] transition hover:opacity-70"
          >
            답변
          </button>
        )}
      </div>
    </div>
  );
}