"use client";

import { useParams } from "next/navigation";
import SubHeader from "@/features/contentmanage/SubHeader";
import QnaCard from "@/features/contentmanage/qna/QnaCard";
import QnaAnswerCard from "@/features/contentmanage/qna/QnaAnswerCard";
import QnaCommentForm from "@/features/contentmanage/qna/QnaCommentForm";
import {
  qnas,
} from "@/features/contentmanage/MockData";

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

        <QnaAnswerCard
          writer="이관리자"

          createdAt={qna.createdAt}

          answer={qna.answer}

          onEdit={() => {

            console.log("수정");
          }}

          onDelete={() => {

            console.log("삭제");
          }}
        />
      )}

      {/* 댓글 */}
      <QnaCommentForm
        comments={qna.comments}
      />
    </div>
  );
}