"use client";

import { useState } from "react";

interface QnaFormProps {
  initialAnswer?: string;
  mode?: "create" | "edit";
}

export default function QnaForm({
  initialAnswer = "",

  mode = "create",
}: QnaFormProps) {

  const [answer, setAnswer] =
    useState(initialAnswer);

  return (
    <div className="mt-4 rounded-[18px] border border-[#E4E7EC] bg-white p-5">

      {/* 제목 */}
      <h2 className="text-[16px] font-bold text-[#111827]">
        답변 작성
      </h2>

      {/* textarea */}
      <textarea
        value={answer}

        onChange={(e) =>
          setAnswer(
            e.target.value
          )
        }

        placeholder="학생의 질문에 대한 답변을 작성해주세요..."

        className="mt-5 h-[180px] w-full resize-none rounded-[14px] border border-[#E4E7EC] p-4 text-[14px] outline-none placeholder:text-[#98A2B3]"
      />

      {/* 버튼 */}
      <div className="mt-5 flex justify-end gap-3">

        {/* 취소 */}
        <button
          type="button"
          className="h-[40px] rounded-[12px] border border-[#E4E7EC] px-4 text-[13px] font-semibold text-[#667085]"
        >
          취소
        </button>

        {/* 등록 */}
        <button
          type="button"
          className="flex h-[40px] items-center gap-2 rounded-[12px] bg-[#439A97] px-4 text-[13px] font-semibold text-white"
        >

          <img
            src="/images/send.svg"
            alt="전송"
            className="h-[14px] w-[14px]"
          />

          {mode === "create"
            ? "답변 등록"
            : "답변 수정"}
        </button>
      </div>
    </div>
  );
}