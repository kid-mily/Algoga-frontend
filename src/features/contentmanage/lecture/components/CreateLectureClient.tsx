"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LectureHeader from "@/features/common/components/LectureHeader";
import LectureForm from "@/features/contentmanage/lecture/components/LectureForm";
import LectureChapterForm from "@/features/contentmanage/lecture/components/LectureChapterForm";
import {
  deleteLectureAction,
  publishLectureAction,
} from "@/features/contentmanage/lecture/actions";
import CheckModal from "@/features/common/components/CheckModal";
import CompleteModal from "@/features/common/components/CompleteModal";
import LectureCreateStepIndicator from "./LectureCreateStepIndicator";
import LectureQuizForm from "./LectureQuizForm";

export default function CreateLectureClient() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdCourseId, setCreatedCourseId] = useState<number | null>(null);
  const [shouldPublish, setShouldPublish] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCourseCreated = (courseId: number, publish: boolean) => {
    if (!courseId || Number.isNaN(courseId)) {
      alert("강의 ID를 찾지 못했습니다.");
      return;
    }

    // 강의는 챕터·퀴즈가 각 1개 이상 있어야 등록이 완료된 것으로 취급하므로,
    // 건너뛸 수 있는 선택지 없이 바로 챕터 등록 단계로 넘어갑니다.
    setCreatedCourseId(courseId);
    setShouldPublish(publish);
    setStep(2);
  };

  const handleQuizSubmitted = async () => {
    if (!createdCourseId) {
      throw new Error("강의 ID를 찾지 못했습니다.");
    }

    if (shouldPublish) {
      await publishLectureAction(createdCourseId);
    }

    setOpenModal(true);
  };

  const handleConfirmCancel = async () => {
    if (isCancelling) return;

    if (!createdCourseId) {
      setIsCancelModalOpen(false);
      router.push("/contentadmin/lecture");
      return;
    }

    try {
      setIsCancelling(true);
      await deleteLectureAction(createdCourseId);
      setIsCancelModalOpen(false);
      router.push("/contentadmin/lecture");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "작성 중인 강의 삭제에 실패했습니다.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8]" aria-labelledby="create-lecture-title">
      <section aria-labelledby="create-lecture-title">
        <LectureHeader
          title="강의 등록"
          description="강의는 챕터와 퀴즈가 각 1개 이상 등록되어야 완료됩니다."
          onClose={() => setIsCancelModalOpen(true)}
          isClosing={isCancelling}
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
              onSubmit={handleQuizSubmitted}
            />
          )}

          <CompleteModal
            open={openModal}
            title="등록 완료"
            description={
              shouldPublish
                ? "강의, 챕터, 퀴즈가 등록되고 공개되었습니다."
                : "강의, 챕터, 퀴즈가 비공개 상태로 등록되었습니다."
            }
            buttonText="확인"
            onConfirm={() => {
              setOpenModal(false);
              router.push("/contentadmin/lecture");
            }}
          />

          <CheckModal
            open={isCancelModalOpen}
            title="강의 등록을 중단할까요?"
            description="중간에 나가면 지금까지 작성한 내용은 저장되지 않습니다."
            buttonText={isCancelling ? "나가는 중..." : "나가기"}
            cancelText="계속 작성"
            isProcessing={isCancelling}
            onCancel={() => setIsCancelModalOpen(false)}
            onConfirm={handleConfirmCancel}
          />
        </div>
      </section>
    </main>
  );
}
