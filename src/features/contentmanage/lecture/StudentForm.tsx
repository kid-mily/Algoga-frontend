"use client";

import { useState, useEffect } from "react";
import StudentItem from "./StudentItem";
import { getCourseStudents } from "@/features/services/adminStudent.service";
// 🌟 스피너 추가
import LoadingSpinner from "@/features/common/LoadingSpinner";

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  courseId: number | null; 
  courseTitle?: string;    
}

export default function StudentForm({
  open,
  onClose,
  courseId,
  courseTitle = "강의 수강생 목록",
}: StudentFormProps) {
  const [students, setStudents] = useState<any[]>([]);
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
        
        const mappedData = data.map((s) => ({
          id: s.userId,
          name: s.userName,
          lecture: courseTitle,
          email: s.email,
          status: "progress", 
          progress: 0,
          quizComplete: false,
          reviewWritten: false,
          createdAt: s.enrolledAt ? s.enrolledAt.substring(0, 10) : "-",
        }));
        
        setStudents(mappedData);
      } catch (error: any) {
        setApiError(error.message || "수강생 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (open && courseId) {
      fetchStudents();
    } else {
      setStudents([]);
      setSelectedIds([]);
      setApiError("");
    }
  }, [open, courseId, courseTitle]);

  if (!open) return null;

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
      <div className="w-full max-w-[1400px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-start justify-between bg-[#439A97] px-7 py-5">
          <div>
            <h2 className="text-[32px] font-bold text-white">
              {courseTitle}
            </h2>
            <p className="mt-1 text-[16px] text-white/80">
              수강생 관리 대시보드 · 총 {students.length}명
            </p>
          </div>
        </div>

        {apiError && (
          <div className="bg-[#FEF2F2] px-7 py-3 text-[14px] font-medium text-[#DC2626]">
            🚨 {apiError}
          </div>
        )}

        {/* 검색 + 액션 */}
        <div className="flex items-center justify-between border-b border-[#E4E7EC] px-7 py-4">
          <div className="flex h-[52px] w-[420px] items-center rounded-[14px] border border-[#D0D5DD] bg-white px-4">
            <img src="/images/search.svg" alt="검색" className="h-[20px] w-[20px]" />
            <input type="text" placeholder="이름, 이메일로 검색..." className="ml-3 w-full bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#98A2B3]" />
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex h-[44px] items-center rounded-[12px] border border-[#DCE7FF] bg-[#EEF4FF] px-4 text-[14px] font-semibold text-[#439A97]">
                ✓ {selectedIds.length}명 선택됨
              </div>
              <button onClick={() => setSelectedIds([])} className="h-[44px] rounded-[12px] border border-[#E4E7EC] bg-white px-5 text-[14px] font-semibold text-[#667085]">
                선택 해제
              </button>
              <button className="flex h-[44px] items-center gap-2 rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white">
                <img src="/images/bell.svg" alt="알림" className="h-[20px] w-[20px]" />
                알림 전송
              </button>
            </div>
          )}
        </div>

        {/* 테이블 헤더 */}
        <div className="grid grid-cols-[50px_2fr_1.3fr_120px_200px_100px_100px_100px] items-center border-b border-[#E4E7EC] bg-[#FCFCFD] px-6 py-4 text-[14px] font-semibold text-[#667085]">
          <div>
            <input
              type="checkbox"
              checked={students.length > 0 && selectedIds.length === students.length}
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

        {/* 학생 리스트 ( 스피너 영역) */}
        <div className="max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="flex h-[200px] w-full items-center justify-center">
              <LoadingSpinner text="수강생 정보를 불러오는 중입니다..." />
            </div>
          ) : students.length === 0 && !apiError ? (
            <div className="p-10 text-center text-[#667085]">현재 이 강의를 수강 중인 학생이 없습니다.</div>
          ) : (
            students.map((student) => (
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
                onCheck={() => handleSelect(student.id)}
              />
            ))
          )}
        </div>

        {/* 하단 */}
        <div className="flex justify-end border-t border-[#E4E7EC] px-7 py-5">
          <button onClick={onClose} className="h-[46px] rounded-[14px] border border-[#E4E7EC] px-7 text-[15px] font-semibold text-[#667085]">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}