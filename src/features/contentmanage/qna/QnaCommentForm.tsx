"use client";

import { useState } from "react";

import CompleteModal from "@/features/common/components/CompleteModal";

interface Comment {
  id: number;
  writer: string;
  createdAt: string;
  content: string;
  isInstructor?: boolean;
}

interface QnaCommentFormProps {
  comments: Comment[];
}

export default function QnaCommentForm({
  comments,
}: QnaCommentFormProps) {

  const [comment, setComment] =
    useState("");

  const [openCompleteModal, setOpenCompleteModal] =
    useState(false);

  return (
    <>
      <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-5">

        {/* 제목 */}
        <h2 className="text-[16px] font-bold text-[#111827]">

          답글 ({comments.length})
        </h2>

        {/* 댓글 리스트 */}
        <div className="mt-5 space-y-4">

          {comments.map((comment) => (

            <div
              key={comment.id}

              className={`rounded-[16px] border border-[#E4E7EC] p-4 ${
                comment.isInstructor
                  ? "bg-[#F5F7FF]"
                  : "bg-white"
              }`}
            >

              {/* 상단 */}
              <div className="flex items-center gap-3">

                {/* 프로필 */}
                <div
                  className={`flex h-[34px] w-[34px] items-center justify-center rounded-full text-[14px] font-bold ${
                    comment.isInstructor
                      ? "bg-[#4F46E5] text-white"
                      : "bg-[#E5E7EB] text-[#667085]"
                  }`}
                >

                  {comment.writer[0]}
                </div>

                {/* 이름 */}
                <div className="flex items-center gap-2">

                  <p className="text-[15px] font-bold text-[#111827]">

                    {comment.writer}
                  </p>

                  {comment.isInstructor && (

                    <span className="text-[13px] font-semibold text-[#4F46E5]">

                      강사
                    </span>
                  )}

                  <span className="text-[13px] text-[#98A2B3]">

                    • {comment.createdAt}
                  </span>
                </div>
              </div>

              {/* 내용 */}
              <p className="mt-3 text-[15px] leading-[1.6] text-[#344054]">

                {comment.content}
              </p>
            </div>
          ))}
        </div>

        {/* 입력창 */}
        <textarea
          value={comment}

          onChange={(e) =>
            setComment(
              e.target.value
            )
          }

          placeholder="답글을 입력하세요..."

          className="mt-5 h-[110px] w-full resize-none rounded-[14px] border border-[#E4E7EC] p-4 text-[14px] outline-none placeholder:text-[#98A2B3]"
        />

        {/* 버튼 */}
        <div className="mt-5 flex justify-end gap-3">

          <button
            type="button"

            onClick={() => {

              console.log("답글 등록");

              setOpenCompleteModal(true);
            }}

            className="flex h-[40px] items-center gap-2 rounded-[12px] bg-[#439A97] px-4 text-[13px] font-semibold text-white"
          >
            <img
              src="/images/send.svg"
              alt="전송"
              className="h-[14px] w-[14px]"
            />

            답글 등록
          </button>
        </div>
      </div>

      {/* 완료 모달 */}
      <CompleteModal
        open={openCompleteModal}
        title="등록 완료"
        description="답글 등록이 완료되었습니다."
        buttonText="확인"
        onConfirm={() =>
          setOpenCompleteModal(false)
        }
      />
    </>
  );
}