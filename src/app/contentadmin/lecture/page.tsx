"use client";

import { useState } from "react";
import Link from "next/link";

import ContentSubHeader from "@/features/contentmanage/SubHeader";
import LectureCard from "@/features/contentmanage/LectureCard";
import StudentForm from "@/features/contentmanage/StudentForm";
import { useRouter } from "next/navigation";
import { lectures } from "@/features/contentmanage/MockData";

export default function LecturePage() {

  // 현재 페이지
  const [currentPage, setCurrentPage] =
    useState(1);

  // 상태 필터
  const [statusFilter, setStatusFilter] =
    useState("all");

  // 한 페이지당 보여줄 개수
  const itemsPerPage = 10;
  const router = useRouter();


  // 상태 필터링
  const filteredLectures =
    lectures.filter((lecture) => {

      if (statusFilter === "public") {
        return lecture.isPublic;
      }

      if (statusFilter === "private") {
        return !lecture.isPublic;
      }

      return true;
    });

  // 시작 index
  const startIndex =
    (currentPage - 1) * itemsPerPage;

  // 현재 페이지 데이터
  const currentLectures =
    filteredLectures.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // 총 페이지 수
  const totalPages = Math.ceil(
    filteredLectures.length / itemsPerPage
  );

  const [openStudentModal, setOpenStudentModal] =
  useState(false);

  return (
    <div className="w-full">

      {/* 상단 헤더 */}
      <ContentSubHeader
        backHref="/contentadmin"
        backText="메인페이지로 돌아가기"
        title="강의 관리"
        description="나라별 강의 콘텐츠를 등록하고 관리합니다"
      />

      {/* 검색 + 버튼 */}
      <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">

        <div className="flex flex-wrap gap-3">

          {/* 검색 */}
          <div className="flex h-[42px] min-w-0 flex-1 items-center rounded-[12px] border border-[#E4E7EC] px-3">

            <img
              src="/images/search.svg"
              alt="검색"
              className="h-[15px] w-[15px]"
            />

            <input
              type="text"
              placeholder="강의 제목 검색..."
              className="ml-2 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#98A2B3]"
            />
          </div>

          {/* 국가 */}
          <select className="h-[42px] w-[100px] rounded-[12px] border border-[#E4E7EC] px-2 text-[13px] outline-none">

            <option>
              전체 국가
            </option>
          </select>

          {/* 상태 */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(
                e.target.value
              );

              setCurrentPage(1);
            }}
            className="h-[42px] w-[100px] rounded-[12px] border border-[#E4E7EC] px-2 text-[13px] outline-none"
          >

            <option value="all">
              전체
            </option>

            <option value="public">
              공개
            </option>

            <option value="private">
              비공개
            </option>
          </select>

          {/* 등록 버튼 */}
          <Link
            href="/contentadmin/lecture/new"
            className="flex h-[42px] whitespace-nowrap rounded-[12px] bg-[#439A97] px-4 text-[13px] font-semibold text-white"
          >

            <div className="flex items-center">
              + 강의 등록
            </div>
          </Link>
        </div>
      </div>

      {/* 테이블 */}
      <div className="mt-5 rounded-[20px] border border-[#E4E7EC] bg-white">

        {/* 헤더 */}
        <div className="grid grid-cols-11 border-b border-[#E4E7EC] bg-[#FCFCFD] px-5 py-4 text-[13px] font-semibold text-[#667085]">
          <div>썸네일</div>
          <div>국가</div>
          <div className="col-span-2" >강의 제목</div>
          <div >가격</div>
          <div>수강생</div>
          <div >챕터</div>
          <div>챕터관리</div>
          <div >등록일</div>
          <div className="text-center">상태</div>
          <div className="text-center">액션</div>
        </div>

        {/* 리스트 */}
        {currentLectures.map((lecture) => (

          <LectureCard
            thumbnail={lecture.thumbnail}
            country={lecture.country}
            title={lecture.title}
            description={lecture.description}
            price={lecture.price}
            students={lecture.students}
            chapters={lecture.chapters}
            createdAt={lecture.createdAt}
            isPublic={lecture.isPublic}

            onUsersClick={() =>
              setOpenStudentModal(true)
            }

        onEditClick={() =>
        router.push(
    `/contentadmin/lecture/${lecture.id}/edit`
  )
      } 
          />
        ))}

        {/* 데이터 없을 때 */}
        {currentLectures.length === 0 && (

          <div className="flex h-[200px] items-center justify-center text-[14px] text-[#98A2B3]">

            검색 결과가 없습니다.
          </div>
        )}

        {/* 하단 */}
        <div className="flex items-center justify-between px-4 py-4">

          {/* 총 개수 */}
          <p className="text-[13px] font-medium text-[#667085]">
            총 {filteredLectures.length}개의 강의
          </p>

          {/* 페이지네이션 */}
          <div className="flex items-center gap-2">

            {/* 이전 */}
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.max(prev - 1, 1)
                )
              }
              className="h-[38px] rounded-[12px] border border-[#E4E7EC] px-4 text-[13px] font-semibold text-[#667085]"
            >
              이전
            </button>

            {/* 페이지 번호 */}
            {Array.from(
              { length: totalPages },
              (_, index) => {

                const page = index + 1;

                return (
                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`flex h-[38px] w-[38px] items-center justify-center rounded-[12px] text-[13px] font-semibold ${
                      currentPage === page
                        ? "bg-[#439A97] text-white"
                        : "border border-[#E4E7EC] text-[#667085]"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
            )}

            {/* 다음 */}
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    totalPages
                  )
                )
              }
              className="h-[38px] rounded-[12px] border border-[#E4E7EC] px-4 text-[13px] font-semibold text-[#667085]"
            >
              다음
            </button>
          </div>
        </div>
      </div>
      <StudentForm
        open={openStudentModal}
        onClose={() =>
          setOpenStudentModal(false)
        }
      />
    </div>
  );
}