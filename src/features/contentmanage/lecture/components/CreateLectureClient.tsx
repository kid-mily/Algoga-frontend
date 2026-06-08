"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LectureHeader from "@/features/contentmanage/common/LectureHeader";
import LectureForm from "@/features/contentmanage/lecture/components/LectureForm";
import LectureChapterForm from "@/features/contentmanage/lecture/components/LectureChapterForm";
import CompleteModal from "@/features/common/CompleteModal";
import LectureCreateStepIndicator from "./LectureCreateStepIndicator";

export default function CreateLectureClient() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [createdCourseId, setCreatedCourseId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleCourseCreated = (courseId: number) => {
    if (!courseId || Number.isNaN(courseId)) {
      alert("강의 ID를 찾을 수 없습니다.");
      return;
    }

    setCreatedCourseId(courseId);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <LectureHeader
        title="강의 등록"
        description="여행 강의를 등록하고 관리합니다"
      />

      <LectureCreateStepIndicator step={step} />

      <div className="px-10 py-10">
        <div className="mx-auto max-w-[1500px]">
          {step === 1 && <LectureForm onNext={handleCourseCreated} />}

          {step === 2 && createdCourseId !== null && (
            <LectureChapterForm
              courseId={createdCourseId}
              onPrev={() => setStep(1)}
              onSubmit={() => setOpenModal(true)}
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
