"use client";

interface QnaAnswerCardProps {
  writer: string;

  createdAt: string;

  answer: string;

  onEdit?: () => void;

  onDelete?: () => void;
}

export default function QnaAnswerCard({
  writer,
  createdAt,
  answer,

  onEdit,
  onDelete,
}: QnaAnswerCardProps) {

  return (
    <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-5">

      {/* 제목 */}
      <h2 className="text-[16px] font-bold text-[#111827]">
        등록된 답변
      </h2>

      {/* 작성자 */}
      <div className="mt-5 flex items-center gap-3">

        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#EEF2FF] text-[15px] font-bold text-[#4F46E5]">

          {writer[0]}
        </div>

        <div className="flex items-center gap-2">

          <p className="text-[15px] font-bold text-[#111827]">
            {writer}
          </p>

          <span className="text-[13px] text-[#98A2B3]">
            • {createdAt}
          </span>
        </div>
      </div>

      {/* 답변 */}
      <div className="mt-4 rounded-[14px] bg-[#F5F7FF] p-4 text-[15px] leading-[1.6] text-[#344054]">

        {answer}
      </div>

      {/* 버튼 */}
      <div className="mt-5 flex justify-end gap-3 border-t border-[#E4E7EC] pt-5">

        <button
          type="button"
          onClick={onEdit}
          className="h-[40px] rounded-[12px] border border-[#E4E7EC] px-4 text-[13px] font-semibold text-[#667085]"
        >
          답변 수정
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="h-[40px] rounded-[12px] border border-[#F04438] px-4 text-[13px] font-semibold text-[#F04438]"
        >
          답변 삭제
        </button>
      </div>
    </div>
  );
}