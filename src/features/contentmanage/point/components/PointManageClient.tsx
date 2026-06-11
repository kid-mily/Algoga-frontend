"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CompleteModal from "@/features/common/CompleteModal";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import { useAdminPointList } from "../hooks/useAdminPointList";
import { PointAdjustMode, SelectedPointStudent, StudentPointInfo } from "../types";
import PointAdjustModal from "./PointAdjustModal";
import PointTable from "./PointTable";

export default function PointManageClient() {
  const router = useRouter();
  const {
    students,
    isLoading,
    error,
    giveStudentPoints,
    recallStudentPoints,
  } = useAdminPointList();

  const [modalMode, setModalMode] = useState<PointAdjustMode>("give");
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<SelectedPointStudent | null>(null);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [completeText, setCompleteText] = useState("");

  const openAdjustModal = (
    mode: PointAdjustMode,
    student: StudentPointInfo
  ) => {
    setModalMode(mode);
    setSelectedStudent({
      userId: student.userId,
      name: student.userName,
      point: student.totalPoint,
    });
    setIsAdjustOpen(true);
  };

  const handleSubmit = async (amount: number, reason: string) => {
    if (!selectedStudent) {
      return false;
    }

    const payload = {
      userId: selectedStudent.userId,
      amount,
      reason,
    };
    const success =
      modalMode === "give"
        ? await giveStudentPoints(payload)
        : await recallStudentPoints(payload);

    if (success) {
      setIsAdjustOpen(false);
      setCompleteText(
        modalMode === "give"
          ? "마일리지가 성공적으로 지급되었습니다."
          : "마일리지가 성공적으로 회수되었습니다."
      );
      setCompleteOpen(true);
    }

    return success;
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SimpleSubHeader
        title="마일리지 관리"
        description="사용자 마일리지를 조회하고 지급합니다"
      />

      {error && (
        <section
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-4 font-medium text-red-600"
        >
          {error}
        </section>
      )}

      <PointTable
        students={students}
        isLoading={isLoading}
        onDetail={(studentId) => router.push(`/contentadmin/point/${studentId}`)}
        onGive={(student) => openAdjustModal("give", student)}
        onRecall={(student) => openAdjustModal("recall", student)}
      />

      <PointAdjustModal
        open={isAdjustOpen}
        mode={modalMode}
        studentName={selectedStudent?.name || ""}
        currentPoint={selectedStudent?.point || 0}
        onClose={() => setIsAdjustOpen(false)}
        onSubmit={handleSubmit}
      />

      <CompleteModal
        open={completeOpen}
        title="처리 완료"
        description={completeText}
        buttonText="확인"
        onConfirm={() => setCompleteOpen(false)}
      />
    </main>
  );
}
