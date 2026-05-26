"use client";

import { useState } from "react";

import LectureHeader from "@/features/contentmanage/LectureHeader";
import LectureForm from "@/features/contentmanage/LectureForm";
import LectureChapterForm from "@/features/contentmanage/LectureChapterForm";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/CompleteModal";

export default function CreateLecturePage() {

  // 현재 step
  const [step, setStep] =
    useState<1 | 2>(1);
    const router = useRouter();

    const [openModal, setOpenModal] =useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8F8]">

      {/* 상단 헤더 */}
      <LectureHeader
        title="새 강의 등록"
        description="여행 강의를 등록하고 관리합니다"
      />

      {/* step 영역 */}
      <div className="border-b border-[#E4E7EC] bg-white py-7">

        <div className="mx-auto flex max-w-[900px] items-center justify-center">

          {/* step 1 */}
          <div className="flex items-center">

            {/* 번호 */}
            <div
              className={`flex h-[40px] w-[40px] items-center justify-center rounded-full text-[18px] font-semibold ${
                step >= 1
                  ? "bg-[#439A97] text-white"
                  : "bg-[#F2F4F7] text-[#98A2B3]"
              }`}
            >
              1
            </div>

            {/* 텍스트 */}
            <div className="ml-4">
              <p className="text-[16px] font-semibold text-[#111827]">
                강의 기본 정보
              </p>

              <p className="mt-1 text-[14px] text-[#98A2B3]">
                기본적인 강의 정보를 입력합니다
              </p>
            </div>
          </div>

          {/* 선 */}
          <div className="mx-12 h-px w-[120px] bg-[#E4E7EC]" />

          {/* step 2 */}
          <div className="flex items-center">

            {/* 번호 */}
            <div
              className={`flex h-[40px] w-[40px] items-center justify-center rounded-full text-[18px] font-semibold ${
                step >= 2
                  ? "bg-[#439A97] text-white"
                  : "bg-[#F2F4F7] text-[#98A2B3]"
              }`}
            >
              2
            </div>

            {/* 텍스트 */}
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

      {/* form 영역 */}
      <div className="px-10 py-10">

        <div className="mx-auto max-w-[1500px]">

        {/* STEP 1 */}
        {step === 1 && (
            <LectureForm
              onNext={() => setStep(2)}
        />
        )}
          
        {/* STEP 2 */}
        {step === 2 && (
  <LectureChapterForm
    onPrev={() => setStep(1)}
    onSubmit={(chapters) => {

      console.log(chapters);

      setOpenModal(true);
    }}
  />
)}

        <CompleteModal
          open={openModal}
          title="등록 완료"
          description="강의 등록이 완료되었습니다."
          buttonText="확인"
          onConfirm={() => {

            setOpenModal(false);

            //강의관리페이지로 이동
            router.push(
              "/contentadmin/lecture"
            );
          }}
        />
             
        </div>
      </div>
    </div>
  );
}