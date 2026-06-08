"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LectureHeader from "@/features/contentmanage/common/LectureHeader";
import LectureForm from "@/features/contentmanage/lecture/LectureForm";
import LectureChapterForm from "@/features/contentmanage/lecture/LectureChapterForm";
import CompleteModal from "@/features/common/CompleteModal";

export default function CreateLecturePage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [createdCourseId, setCreatedCourseId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleCourseCreated = (courseId: number) => {
    console.log("new/page.tsx에서 받은 courseId:", courseId);

    if (!courseId || Number.isNaN(courseId)) {
      alert("강의 ID를 찾을 수 없습니다. 강의 등록 응답을 확인해주세요.");
      return;
    }

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
          {/* 스텝 1 */}
          <div className="flex items-center">
            <div
              className={`flex h-[40px] w-[40px] items-center justify-center rounded-full text-[18px] font-semibold ${
                step >= 1
                  ? "bg-[#439A97] text-white"
                  : "bg-[#F2F4F7] text-[#98A2B3]"
              }`}
            >
              1
            </div>
            <div className="ml-4">
              <p className="text-[16px] font-semibold text-[#111827]">
                강의 기본 정보
              </p>
              <p className="mt-1 text-[14px] text-[#98A2B3]">
                기본적인 강의 정보를 입력합니다
              </p>
            </div>
          </div>

          <div className="mx-12 h-px w-[120px] bg-[#E4E7EC]" />

          {/* 스텝 2 */}
          <div className="flex items-center">
            <div
              className={`flex h-[40px] w-[40px] items-center justify-center rounded-full text-[18px] font-semibold ${
                step >= 2
                  ? "bg-[#439A97] text-white"
                  : "bg-[#F2F4F7] text-[#98A2B3]"
              }`}
            >
              2
            </div>
            <div className="ml-4">
              <p className="text-[16px] font-semibold text-[#111827]">
                챕터 상세 정보
              </p>
              <p className="mt-1 text-[14px] text-[#98A2B3]">
                강의 챕터를 구성합니다
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 py-10">
        <div className="mx-auto max-w-[1500px]">
          {step === 1 && <LectureForm onNext={handleCourseCreated} />}

          {/* 🌟 수정된 부분: (createdCourseId as number)를 사용하여 TS 에러 완벽 해결! */}
          {step === 2 && createdCourseId !== null && (
            <LectureChapterForm
              courseId={createdCourseId as number} 
              onPrev={() => setStep(1)}
              onSubmit={() => {
                setOpenModal(true);
              }}
            />
          )}

          <CompleteModal
            open={openModal}
            title="등록 완료"
            description="강의와 챕터 등록이 완료되었습니다."
            buttonText="확인"
            onConfirm={() => {
              setOpenModal(false);
              router.push("/contentadmin/lecture");
            }}
          />
        </div>
      </div>
    </div>
  );
}