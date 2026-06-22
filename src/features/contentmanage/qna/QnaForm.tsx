"use client";

import { useState } from "react";

import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";

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

  const [openEditModal, setOpenEditModal] = useState(false);

  const [openCompleteModal, setOpenCompleteModal] = useState(false);

  // 제출
  const handleSubmit = () => {

    // 등록
    if (mode === "create") {

      console.log("답변 등록");

      setOpenCompleteModal(true);

    } else {

      // 수정
      setOpenEditModal(true);
    }
  };

  return (
    <>
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

            onClick={handleSubmit}

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

      {/* 수정 확인 */}
      <Modal
        open={openEditModal}
        title="답변 수정"
        description="변경사항을 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={() => {

          console.log("답변 수정");

          setOpenEditModal(false);

          setOpenCompleteModal(true);
        }}
        onCancel={() =>
          setOpenEditModal(false)
        }
      />

      {/* 완료 모달 */}
      <CompleteModal
        open={openCompleteModal}
        title={
          mode === "create"
            ? "등록 완료"
            : "수정 완료"
        }
        description={
          mode === "create"
            ? "답변 등록이 완료되었습니다."
            : "답변 수정이 완료되었습니다."
        }
        buttonText="확인"
        onConfirm={() =>
          setOpenCompleteModal(false)
        }
      />
    </>
  );
}