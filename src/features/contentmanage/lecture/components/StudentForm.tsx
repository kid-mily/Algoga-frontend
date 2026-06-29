"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import Image from "next/image";
import StudentItem from "./StudentItem";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import { useCourseStudents } from "../hooks/useCourseStudents";
import type { StudentFormProps } from "../types";

export default function StudentForm({
  open,
  onClose,
  courseId,
  courseTitle = "강의 수강생",
}: StudentFormProps) {
  const {
    apiError,
    filteredStudents,
    isLoading,
    searchKeyword,
    selectedIds,
    students,
    clearSelectedIds,
    handleClose,
    handleSelect,
    handleSelectAll,
    setSearchKeyword,
  } = useCourseStudents({ open, courseId, courseTitle, onClose });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-8">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-dialog-title"
        className="w-full max-w-[1400px] overflow-hidden rounded-[24px] bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between bg-[#439A97] px-7 py-5">
          <div>
            <h2 id="student-dialog-title" className="text-[32px] font-bold text-white">
              {courseTitle}
            </h2>
            <p className="mt-1 text-[16px] text-white/80">
              수강생 관리 - 총 {students.length}명
            </p>
          </div>
        </header>

        <AdminErrorBanner message={apiError} className="" />

        <form
          role="search"
          aria-label="수강생 검색"
          className="flex items-center justify-between border-b border-[#E4E7EC] px-7 py-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex h-[52px] w-[420px] items-center rounded-[14px] border border-[#D0D5DD] bg-white px-4">
            <Image src="/images/search.svg" alt="" aria-hidden="true" width={20} height={20} />
            <label htmlFor="student-search" className="sr-only">
              수강생 검색
            </label>
            <input
              id="student-search"
              type="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="이름 또는 이메일 검색"
              className="ml-3 w-full bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#98A2B3]"
            />
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex h-[44px] items-center rounded-[12px] border border-[#DCE7FF] bg-[#EEF4FF] px-4 text-[14px] font-semibold text-[#439A97]">
                {selectedIds.length}명 선택됨
              </div>
              <button
                type="button"
                onClick={clearSelectedIds}
                className="h-[44px] rounded-[12px] border border-[#E4E7EC] bg-white px-5 text-[14px] font-semibold text-[#667085]"
              >
                선택 해제
              </button>
              <button
                type="button"
                className="flex h-[44px] items-center gap-2 rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white"
              >
                <Image src="/images/bell.svg" alt="" aria-hidden="true" width={20} height={20} />
                알림 보내기
              </button>
            </div>
          )}
        </form>

        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full table-fixed border-collapse">
            <caption className="sr-only">
              이 강의를 수강 중인 수강생 목록입니다.
            </caption>
            <thead>
              <tr className="border-b border-[#E4E7EC] bg-[#FCFCFD] text-[14px] font-semibold text-[#667085]">
                <th scope="col" className="w-[50px] px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredStudents.length > 0 &&
                      filteredStudents.every((student) =>
                        selectedIds.includes(student.id)
                      )
                    }
                    onChange={handleSelectAll}
                    aria-label="전체 수강생 선택"
                    className="h-[18px] w-[18px] accent-[#439A97]"
                  />
                </th>
                <th scope="col" className="px-6 py-4 text-left">수강생</th>
                <th scope="col" className="px-6 py-4 text-left">이메일</th>
                <th scope="col" className="px-6 py-4 text-left">상태</th>
                <th scope="col" className="px-6 py-4 text-left">진도율</th>
                <th scope="col" className="px-6 py-4 text-left">퀴즈</th>
                <th scope="col" className="px-6 py-4 text-left">리뷰</th>
                <th scope="col" className="px-6 py-4 text-left">완료일</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="h-[200px]">
                    <div className="flex h-full w-full items-center justify-center">
                      <LoadingSpinner text="수강생을 불러오는 중..." />
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 && !apiError ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-[#667085]">
                    {students.length === 0
                      ? "현재 이 강의를 수강 중인 수강생이 없습니다."
                      : "검색 결과가 없습니다."}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <StudentItem
                    key={student.id}
                    id={student.id}
                    name={student.name}
                    lecture={student.lecture}
                    email={student.email}
                    status={student.status}
                    progress={student.progress}
                    quizComplete={student.quizComplete}
                    reviewWritten={student.reviewWritten}
                    createdAt={student.createdAt}
                    checked={selectedIds.includes(student.id)}
                    onCheck={() => handleSelect(student.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex justify-end border-t border-[#E4E7EC] px-7 py-5">
          <button
            type="button"
            onClick={handleClose}
            className="h-[46px] rounded-[14px] border border-[#E4E7EC] px-7 text-[15px] font-semibold text-[#667085]"
          >
            닫기
          </button>
        </footer>
      </section>
    </div>
  );
}
