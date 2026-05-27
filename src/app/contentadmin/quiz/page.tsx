"use client";

import Link from "next/link";
import { useState } from "react";

import QuizList from "@/features/contentmanage/quiz/QuizList";

import {lectures,} from "@/features/contentmanage/MockData";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";

export default function QuizPage() {

  const [selectedLecture, setSelectedLecture] =
    useState<string>("all");

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">

      {/* 헤더 */}
      <SimpleSubHeader
      title="퀴즈 관리"
      description="강의별 퀴즈를 등록하고 관리합니다"
    />

      {/* 검색 영역 */}
      <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          {/* 왼쪽 */}
          <div className="flex flex-1 gap-3">
            {/* 검색 */}
            <div className="flex h-[42px] flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3">
              <img
                src="/images/search.svg"
                alt="검색"
                className="h-[16px] w-[16px]"
              />
              <input
                type="text"
                placeholder="문제 내용 검색..."
                className="ml-2 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
              />
            </div>

            {/* 강의 선택 */}
            <select
              value={selectedLecture}
              onChange={(e) =>
                setSelectedLecture(
                  e.target.value
                )
              }
              className="h-[42px] w-[220px] rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
            >
              <option value="all">
                전체 강의
              </option>
              {lectures.map((lecture) => (
                <option
                  key={lecture.id}
                  value={lecture.id}
                >
                  {lecture.title}
                </option>
              ))}
            </select>
          </div>

          {/* 버튼 */}
          <Link
            href="/contentadmin/quiz/new"
            className="flex h-[42px] items-center rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white transition hover:opacity-90"
          >
            + 퀴즈 등록
          </Link>
        </div>
      </div>

      {/* 리스트 */}
      <QuizList
        lectureId={
          selectedLecture === "all"
            ? undefined
            : Number(
                selectedLecture
              )
        }
      />
    </div>
  );
}