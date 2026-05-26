// Q&Q 답변상세

"use client";

import { useParams } from "next/navigation";

import SubHeader from "@/features/contentmanage/SubHeader";

import QnaCard from "@/features/contentmanage/qna/QnaCard";
import QnaForm from "@/features/contentmanage/qna/QnaForm";

import {
  qnas,
} from "@/features/contentmanage/MockData";

export default function AnswerQnaPage() {

  const params = useParams();

  const qnaid =
    Number(params.qnaid);

  // 현재 질문
  const qna =
    qnas.find(
      (item) =>
        item.id === qnaid
    );

  if (!qna) {

    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">

      {/* 헤더 */}
      <SubHeader
        backHref="/contentadmin/qna"
        backText="Q&A 목록으로 돌아가기"
        title="Q&A 답변 작성"
        description={qna.lecture}
      />

      {/* 질문 카드 */}
      <QnaCard
        writer={qna.writer}
        createdAt={qna.createdAt}
        question={qna.question}
      />

      {/* 답변 폼 */}
      <QnaForm />
    </div>
  );
}