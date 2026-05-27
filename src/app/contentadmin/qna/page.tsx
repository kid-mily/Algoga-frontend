"use client";

import { useState } from "react";

import QnaItem from "@/features/contentmanage/qna/QnaItem";
import { useRouter } from "next/navigation";
import {qnas,} from "@/features/contentmanage/MockData";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";

export default function QnaPage() {

  // 상태 필터
  const [statusFilter, setStatusFilter] =
    useState("all");

  // 현재 페이지
  const [currentPage, setCurrentPage] =
    useState(1);

  // 페이지당 개수
  const ITEMS_PER_PAGE = 10;

  // 필터링
  const filteredQnas =
    qnas.filter((qna) => {

      // 전체
      if (
        statusFilter === "all"
      ) {
        return true;
      }
      // 답변 완료
      if (
        statusFilter === "answered"
      ) {
        return qna.isAnswered;
      }
      // 답변 대기
      if (
        statusFilter === "waiting"
      ) {
        return !qna.isAnswered;
      }
      return true;
    });

  // 전체 페이지 수
  const totalPages = Math.ceil(
    filteredQnas.length /
      ITEMS_PER_PAGE
  );

  // 현재 페이지 데이터
  const currentQnas =
    filteredQnas.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,

      currentPage *
        ITEMS_PER_PAGE
    );
    const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">

      {/* 헤더 */}
      <SimpleSubHeader
      title="Q&A 관리"
      description="학생들의 질문을 관리하고 답변합니다"
      />
      {/* 검색 */}
      <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
        <div className="flex items-center gap-3">
          {/* 검색 */}
          <div className="flex h-[44px] flex-1 items-center rounded-[14px] border border-[#E4E7EC] px-4">
            <img
              src="/images/search.svg"
              alt="검색"
              className="h-[16px] w-[16px]"
            />
            <input
              type="text"
              placeholder="질문 내용, 강의, 작성자 검색..."
              className="ml-3 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
            />
          </div>
          {/* 상태 */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(
                e.target.value
              );

              // 필터 바뀌면 1페이지로
              setCurrentPage(1);
            }}
            className="h-[44px] w-[120px] rounded-[14px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
          >
            <option value="all">전체</option>
            <option value="answered">답변 완료</option>
            <option value="waiting">답변 대기</option>
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="mt-5 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">

        {/* 헤더 */}
        <div className="grid grid-cols-[1.2fr_2fr_0.8fr_0.9fr_0.8fr_0.8fr] border-b border-[#E4E7EC] bg-[#FCFCFD] px-5 py-4 text-[13px] font-semibold text-[#667085]">
          <div>강의</div>
          <div>질문</div>
          <div>작성자</div>
          <div>등록일</div>
          <div>상태</div>
          <div className="text-center">
            액션
          </div>
        </div>

        {/* 리스트 */}
        {currentQnas.map((qna) => (

          <QnaItem
            key={qna.id}
            lecture={qna.lecture}
            question={qna.question}
            writer={qna.writer}
            createdAt={qna.createdAt}
            isAnswered={qna.isAnswered}
            onView={() =>
              router.push(
                `/contentadmin/qna/${qna.id}/edit`
              )
            }
            onAnswer={() =>
              router.push(
                `/contentadmin/qna/${qna.id}`
              )
            }
            onDelete={() => {
              console.log("삭제");
            }}
          />
        ))}

        {/* 하단 */}
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-[14px] text-[#667085]">
            총 {filteredQnas.length}개의 문의
          </p>

          {/* 페이지네이션 */}
          <div className="flex items-center gap-2">

            {/* 이전 */}
            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(
                      prev - 1,
                      1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
              className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-medium text-[#667085] disabled:opacity-40"
            >
              이전
            </button>

            {/* 페이지 번호 */}
            {Array.from({
              length: totalPages,
            }).map((_, index) => {

              const page =
                index + 1;

              return (
                <button
                  key={page}
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                  className={`flex h-[36px] w-[36px] items-center justify-center rounded-[10px] text-[14px] font-semibold ${
                    currentPage === page
                      ? "bg-[#439A97] text-white"
                      : "border border-[#E4E7EC] bg-white text-[#667085]"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* 다음 */}
            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className="h-[36px] rounded-[10px] border border-[#E4E7EC] px-4 text-[14px] font-medium text-[#667085] disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}