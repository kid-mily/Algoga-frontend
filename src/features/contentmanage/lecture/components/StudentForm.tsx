"use client";

import { useEffect, useState } from "react";
import StudentItem from "./StudentItem";
import { getCourseStudents } from "@/features/services/adminStudent.service";
import LoadingSpinner from "@/features/common/LoadingSpinner";
import { StudentFormProps, StudentRow } from "../types";

export default function StudentForm({
  open,
  onClose,
  courseId,
  courseTitle = "강의 수강생",
}: StudentFormProps) {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!courseId) return;
      try {
        setIsLoading(true);
        setApiError("");
        const data = await getCourseStudents(courseId);
        const mappedData: StudentRow[] = data.map((student) => ({
          id: student.userId,
          name: student.userName,
          lecture: courseTitle,
          email: student.email,
          status: "progress",
          progress: 0,
          quizComplete: false,
          reviewWritten: false,
          createdAt: student.enrolledAt ? student.enrolledAt.substring(0, 10) : "-",
        }));
        setStudents(mappedData);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "수강생 목록을 불러오지 못했습니다.";
        setApiError(message);
      } finally {
        setIsLoading(false);
      }
    };

    if (open && courseId) {
      void fetchStudents();
    }
  }, [open, courseId, courseTitle]);

  if (!open) return null;

  const handleClose = () => {
    setStudents([]);
    setSelectedIds([]);
    setApiError("");
    onClose();
  };

  const handleSelectAll = () => {
    if (selectedIds.length === students.length && students.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((student) => student.id));
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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

        {apiError && (
          <div role="alert" className="bg-[#FEF2F2] px-7 py-3 text-[14px] font-medium text-[#DC2626]">
            {apiError}
          </div>
        )}

        <form
          role="search"
          aria-label="수강생 검색"
          className="flex items-center justify-between border-b border-[#E4E7EC] px-7 py-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="flex h-[52px] w-[420px] items-center rounded-[14px] border border-[#D0D5DD] bg-white px-4">
            <img src="/images/search.svg" alt="검색" aria-hidden="true" className="h-[20px] w-[20px]" />
            <label htmlFor="student-search" className="sr-only">
              수강생 검색
            </label>
            <input
              id="student-search"
              type="search"
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
                onClick={() => setSelectedIds([])}
                className="h-[44px] rounded-[12px] border border-[#E4E7EC] bg-white px-5 text-[14px] font-semibold text-[#667085]"
              >
                선택 해제
              </button>
              <button
                type="button"
                className="flex h-[44px] items-center gap-2 rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white"
              >
                <img src="/images/bell.svg" alt="종" aria-hidden="true" className="h-[20px] w-[20px]" />
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
                    checked={students.length > 0 && selectedIds.length === students.length}
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
                <th scope="col" className="px-6 py-4 text-left">등록일</th>
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
              ) : students.length === 0 && !apiError ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-[#667085]">
                    현재 이 강의를 수강 중인 수강생이 없습니다.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
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
