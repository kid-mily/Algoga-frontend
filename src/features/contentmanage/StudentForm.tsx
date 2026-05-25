"use client";

import { useState } from "react";

import StudentItem from "./StudentItem";

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
}

export default function StudentForm({
  open,
  onClose,
}: StudentFormProps) {

  if (!open) return null;

  // 임시 데이터
  const students = [
    {
      id: 1,
      name: "김민수",
      lecture: "일본 여행 완벽 가이드",
      email: "minsu@example.com",
      status: "complete" as const,
      progress: 100,
      quizComplete: true,
      reviewWritten: true,
      createdAt: "2024.04.15",
    },
    {
      id: 2,
      name: "이지은",
      lecture: "일본 여행 완벽 가이드",
      email: "jieun@example.com",
      status: "progress" as const,
      progress: 65,
      quizComplete: true,
      reviewWritten: false,
      createdAt: "2024.04.18",
    },
    {
      id: 3,
      name: "박서준",
      lecture: "일본 여행 완벽 가이드",
      email: "seojun@example.com",
      status: "progress" as const,
      progress: 30,
      quizComplete: false,
      reviewWritten: false,
      createdAt: "2024.04.20",
    },
    {
      id: 4,
      name: "최유진",
      lecture: "일본 여행 완벽 가이드",
      email: "yujin@example.com",
      status: "progress" as const,
      progress: 10,
      quizComplete: false,
      reviewWritten: false,
      createdAt: "2024.04.22",
    },
    {
      id: 5,
      name: "정민호",
      lecture: "일본 여행 완벽 가이드",
      email: "minho@example.com",
      status: "complete" as const,
      progress: 100,
      quizComplete: false,
      reviewWritten: false,
      createdAt: "2024.04.25",
    },
  ];

  // 선택된 학생
  const [selectedIds, setSelectedIds] =
    useState<number[]>([]);

  // 전체 선택
  const handleSelectAll = () => {

    if (
      selectedIds.length ===
      students.length
    ) {

      setSelectedIds([]);

    } else {

      setSelectedIds(
        students.map(
          (student) => student.id
        )
      );
    }
  };

  // 개별 선택
  const handleSelect = (
    id: number
  ) => {

    setSelectedIds((prev) =>

      prev.includes(id)

        ? prev.filter(
            (item) => item !== id
          )

        : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-8">

      <div className="w-full max-w-[1400px] overflow-hidden rounded-[24px] bg-white shadow-2xl">

        {/* 헤더 */}
        <div className="flex items-start justify-between bg-[#439A97] px-7 py-5">

          <div>

            <h2 className="text-[32px] font-bold text-white">
              일본 여행 완벽 가이드
            </h2>

            <p className="mt-1 text-[16px] text-white/80">
              수강생 관리 대시보드 · 총 5명
            </p>
          </div>
        </div>

        {/* 검색 + 액션 */}
        <div className="flex items-center justify-between border-b border-[#E4E7EC] px-7 py-4">

          {/* 검색 */}
          <div className="flex h-[52px] w-[420px] items-center rounded-[14px] border border-[#D0D5DD] bg-white px-4">

            <img
              src="/images/search.svg"
              alt="검색"
              className="h-[20px] w-[20px]"
            />

            <input
              type="text"
              placeholder="이름, 이메일로 검색..."
              className="ml-3 w-full bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#98A2B3]"
            />
          </div>

          {/* 선택 액션 */}
          {selectedIds.length > 0 && (

            <div className="flex items-center gap-3">

              {/* 선택됨 */}
              <div className="flex h-[44px] items-center rounded-[12px] border border-[#DCE7FF] bg-[#EEF4FF] px-4 text-[14px] font-semibold text-[#439A97]">

                ✓ {selectedIds.length}명 선택됨
              </div>

              {/* 선택 해제 */}
              <button
                onClick={() =>
                  setSelectedIds([])
                }
                className="h-[44px] rounded-[12px] border border-[#E4E7EC] bg-white px-5 text-[14px] font-semibold text-[#667085]"
              >
                선택 해제
              </button>

              {/* 알림 전송 */}
              <button className="flex h-[44px] items-center gap-2 rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white">

                <img
                  src="/images/bell.svg"
                  alt="알림"
                  className="h-[20px] w-[20px]"
                />

                알림 전송
              </button>
            </div>
          )}
        </div>

        {/* 헤더 */}
        <div className="grid grid-cols-[50px_2fr_1.3fr_120px_200px_100px_100px_100px] items-center border-b border-[#E4E7EC] bg-[#FCFCFD] px-6 py-4 text-[14px] font-semibold text-[#667085]">

          <div>
            <input
              type="checkbox"
              checked={
                selectedIds.length ===
                students.length
              }
              onChange={handleSelectAll}
              className="h-[18px] w-[18px] accent-[#439A97]"
            />
          </div>
          <div>수강생</div>
          <div>이메일</div>
          <div>수강 상태</div>
          <div>진도율</div>
          <div>퀴즈</div>
          <div>후기</div>
          <div>등록일</div>
        </div>

        {/* 학생 리스트 */}
        <div>

          {students.map((student) => (

            <StudentItem
              key={student.id}
              name={student.name}
              lecture={student.lecture}
              email={student.email}
              status={student.status}
              progress={student.progress}
              quizComplete={student.quizComplete}
              reviewWritten={student.reviewWritten}
              createdAt={student.createdAt}

              checked={selectedIds.includes(student.id)}

              onCheck={() =>
                handleSelect(student.id)
              }
            />
          ))}
        </div>

        {/* 하단 */}
        <div className="flex justify-end px-7 py-5">

          <button
            onClick={onClose}
            className="h-[46px] rounded-[14px] border border-[#E4E7EC] px-7 text-[15px] font-semibold text-[#667085]"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}