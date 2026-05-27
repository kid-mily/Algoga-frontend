"use client";

interface QnaCardProps {
  writer: string;
  createdAt: string;
  question: string;
}

export default function QnaCard({
  writer,
  createdAt,
  question,
}: QnaCardProps) {

  return (
    <div className="rounded-[18px] border border-[#E4E7EC] bg-white p-5">

      {/* 제목 */}
      <h2 className="text-[16px] font-bold text-[#111827]">
        학생 질문
      </h2>

      {/* 내용 */}
      <div className="mt-5 flex gap-3">

        {/* 프로필 */}
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#EAF2FF] text-[16px] font-bold text-[#5B6EF5]">

          {writer[0]}
        </div>

        {/* 텍스트 */}
        <div>

          <div className="flex items-center gap-2">

            <p className="text-[16px] font-bold text-[#111827]">
              {writer}
            </p>

            <span className="text-[13px] text-[#98A2B3]">
              • {createdAt}
            </span>
          </div>

          <p className="mt-2 text-[16px] font-medium text-[#344054]">
            {question}
          </p>
        </div>
      </div>
    </div>
  );
}