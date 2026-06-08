"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import SubHeader from "@/features/contentmanage/common/SubHeader";

import QnaCard from "@/features/contentmanage/qna/QnaCard";
import QnaCommentForm from "@/features/contentmanage/qna/QnaCommentForm";

import {
  qnas,
} from "@/features/contentmanage/MockData";

import Modal from "@/features/common/Modal";
import CompleteModal from "@/features/common/CompleteModal";

export default function EditQnaPage() {

  const params = useParams();

  const qnaid =
    Number(params.qnaid);

  // 현재 Q&A 찾기
  const qna =
    qnas.find(
      (item) =>
        item.id === qnaid
    );

  const [answer, setAnswer] =
    useState(
      qna?.answer || ""
    );

  const [isEditing, setIsEditing] =
    useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);

  const [openEditCompleteModal, setOpenEditCompleteModal] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [openDeleteCompleteModal, setOpenDeleteCompleteModal] = useState(false);

  // 없으면 종료
  if (!qna) {

    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">

      {/* 헤더 */}
      <SubHeader
        backHref="/contentadmin/qna"
        backText="Q&A 목록으로 돌아가기"
        title="Q&A 답변 상세"
        description={qna.lecture}
      />

      {/* 질문 */}
      <QnaCard
        writer={qna.writer}

        createdAt={qna.createdAt}

        question={qna.question}
      />

      {/* 답변 */}
      {qna.answer && (

        <div className="mt-5 rounded-[20px] border border-[#E4E7EC] bg-white p-6">

          {/* 상단 */}
          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-[18px] font-bold text-[#111827]">
                관리자 답변
              </h2>

              <p className="mt-1 text-[14px] text-[#98A2B3]">
                이관리자 · {qna.createdAt}
              </p>
            </div>

            {/* 액션 */}
            <div className="flex items-center gap-4">

              {/* 수정 */}
              <button
                type="button"
                onClick={() => {setIsEditing(true);}}
                className="transition hover:opacity-60"
              >
                <img
                  src="/images/edit.svg"
                  alt="수정"
                  className="h-[20px] w-[20px]"
                />
              </button>

              {/* 삭제 */}
              <button
                type="button"
                onClick={() => {setOpenDeleteModal(true);}}
                className="transition hover:opacity-60"
              >
                <img
                  src="/images/delete.svg"
                  alt="삭제"
                  className="h-[20px] w-[20px]"
                />
              </button>
            </div>
          </div>

          {/* textarea */}
          <textarea
            value={answer}

            disabled={!isEditing}

            onChange={(e) =>
              setAnswer(
                e.target.value
              )
            }

            className={`mt-5 h-[180px] w-full resize-none rounded-[16px] border p-4 text-[15px] outline-none ${
              isEditing
                ? "border-[#439A97] bg-white"
                : "border-[#E4E7EC] bg-[#F9FAFB] text-[#667085]"
            }`}
          />

          {/* 수정 버튼 */}
          {isEditing && (

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => {setOpenEditModal(true);}}
                className="h-[44px] rounded-[14px] bg-[#439A97] px-5 text-[14px] font-semibold text-white"
              >
                답변 수정
              </button>
            </div>
          )}
        </div>
      )}

      {/* 댓글 */}
      <QnaCommentForm
        comments={qna.comments}
      />

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

          setOpenEditCompleteModal(true);

          setIsEditing(false);
        }}
        onCancel={() =>
          setOpenEditModal(false)
        }
      />

      {/* 수정 완료 */}
      <CompleteModal
        open={openEditCompleteModal}
        title="수정 완료"
        description="답변 수정이 완료되었습니다."
        buttonText="확인"
        onConfirm={() =>
          setOpenEditCompleteModal(false)
        }
      />

      {/* 삭제 확인 */}
      <Modal
        open={openDeleteModal}
        title="답변 삭제"
        description="정말 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => {

          console.log("답변 삭제");

          setOpenDeleteModal(false);

          setOpenDeleteCompleteModal(true);
        }}
        onCancel={() =>
          setOpenDeleteModal(false)
        }
      />

      {/* 삭제 완료 */}
      <CompleteModal
        open={openDeleteCompleteModal}
        title="삭제 완료"
        description="답변이 삭제되었습니다."
        buttonText="확인"
        onConfirm={() =>
          setOpenDeleteCompleteModal(false)
        }
      />
    </div>
  );
}