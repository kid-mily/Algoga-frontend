"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LectureHeader from "@/features/contentmanage/LectureHeader";
import LectureForm from "@/features/contentmanage/lecture/LectureForm";
import LectureChapterForm from "@/features/contentmanage/lecture/LectureChapterForm";
import CompleteModal from "@/features/common/CompleteModal";

export default function CreateLecturePage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [createdCourseId, setCreatedCourseId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  
  // 🌟 에러 상태 추가
  const [apiError, setApiError] = useState("");

  const handleCourseCreated = (courseId: number) => {
    console.log("new/page.tsx에서 받은 courseId:", courseId);

    if (!courseId || Number.isNaN(courseId)) {
      setApiError("강의 ID를 찾을 수 없습니다. 강의 등록 응답을 확인해주세요.");
      return;
    }

    setApiError("");
    setCreatedCourseId(courseId);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <LectureHeader
        title="새 강의 등록"
        description="여행 강의를 등록하고 관리합니다"
      />

      <div className="border-b border-[#E4E7EC] bg-white py-7">
        <div className="mx-auto flex max-w-[900px] items-center justify-center">
          <div className="flex items-center gap-4">
            <div className={`flex h-[32px] w-[32px] items-center justify-center rounded-full text-[14px] font-bold ${step === 1 ? "bg-[#111827] text-white" : "bg-[#F2F4F7] text-[#98A2B3]"}`}>
              1
            </div>
            <span className={`text-[15px] font-semibold ${step === 1 ? "text-[#111827]" : "text-[#98A2B3]"}`}>강의 기본 정보</span>
            <div className="h-[2px] w-[40px] bg-[#F2F4F7]"></div>
            <div className={`flex h-[32px] w-[32px] items-center justify-center rounded-full text-[14px] font-bold ${step === 2 ? "bg-[#111827] text-white" : "bg-[#F2F4F7] text-[#98A2B3]"}`}>
              2
            </div>
            <span className={`text-[15px] font-semibold ${step === 2 ? "text-[#111827]" : "text-[#98A2B3]"}`}>챕터 상세 정보</span>
          </div>
        </div>
      </div>

      <div className="py-7">
        <div className="mx-auto max-w-[900px]">
          {/* 🌟 에러 발생 시 최상단에 노출 */}
          {apiError && (
            <div className="mb-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]">
              🚨 {apiError}
            </div>
          )}

          {step === 1 && <LectureForm onNext={handleCourseCreated} />}
          {step === 2 && createdCourseId && (
            <LectureChapterForm
              courseId={createdCourseId}
              onPrev={() => setStep(1)}
              onSubmit={() => setOpenModal(true)}
            />
          )}
        </div>
      </div>

      <CompleteModal
        open={openModal}
        title="강의 등록 완료"
        description="새로운 강의가 성공적으로 등록되었습니다."
        buttonText="목록으로 가기"
        onConfirm={() => {
          setOpenModal(false);
          router.push("/contentadmin/lecture");
        }}
      />
    </div>
  );
}