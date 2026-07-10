"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LectureHeader from "@/features/common/components/LectureHeader";
import LectureForm from "@/features/contentmanage/lecture/components/LectureForm";
import LectureChapterForm from "@/features/contentmanage/lecture/components/LectureChapterForm";
import CompleteModal from "@/features/common/components/CompleteModal";
import LectureCreateStepIndicator from "./LectureCreateStepIndicator";
import LectureQuizForm from "./LectureQuizForm";

export default function CreateLectureClient() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdCourseId, setCreatedCourseId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleCourseCreated = (courseId: number) => {
    if (!courseId || Number.isNaN(courseId)) {
      alert("강의 ID를 찾지 못했습니다.");
      return;
    }

    setCreatedCourseId(courseId);
    setStep(2);
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8]" aria-labelledby="create-lecture-title">
      <section aria-labelledby="create-lecture-title">
        <LectureHeader
          title="강의 등록"
          description="강의 콘텐츠와 챕터를 등록합니다."
        />
      </section>

      <LectureCreateStepIndicator step={step} />

      <section className="px-10 py-10" aria-label="강의 등록 단계">
        <div className="mx-auto max-w-[1500px]">
          {step === 1 && <LectureForm onNext={handleCourseCreated} />}

          {step === 2 && createdCourseId !== null && (
            <LectureChapterForm
              courseId={createdCourseId}
              onPrev={() => setStep(1)}
              onSubmit={() => setStep(3)}
            />
          )}

          {step === 3 && createdCourseId !== null && (
            <LectureQuizForm
              courseId={createdCourseId}
              onPrev={() => setStep(2)}
              onSubmit={() => setOpenModal(true)}
            />
          )}

          <CompleteModal
            open={openModal}
            title="등록 완료"
            description="강의, 챕터, 퀴즈가 등록되었습니다."
            buttonText="확인"
            onConfirm={() => {
              setOpenModal(false);
              router.push("/contentadmin/lecture");
            }}
          />
        </div>
      </section>
    </main>
  );
}
