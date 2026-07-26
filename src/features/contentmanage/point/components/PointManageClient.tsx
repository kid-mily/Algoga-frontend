"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CompleteModal from "@/features/common/components/CompleteModal";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import { useAdminPointList } from "../hooks/useAdminPointList";
import { PointAdjustMode, SelectedPointStudent, StudentPointInfo } from "../types";
import PointAdjustModal from "./PointAdjustModal";
import PointPagination from "./PointPagination";
import PointTable from "./PointTable";

export default function PointManageClient() {
  const router = useRouter();
  const {
    students,
    currentPage,
    totalPages,
    isLoading,
    error,
    setCurrentPage,
    giveStudentPoints,
    recallStudentPoints,
  } = useAdminPointList();

  const [searchKeyword, setSearchKeyword] = useState("");
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
    const studentName = student.userName?.trim() || `사용자 #${student.userId}`;

    setModalMode(mode);
    setSelectedStudent({
      userId: student.userId,
      name: studentName,
      point: student.totalPoint,
    });
    setIsAdjustOpen(true);
  };

  const filteredStudents = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      return students;
    }

    return students.filter((student) => {
      return (
        String(student.userId).includes(keyword) ||
        student.userName.toLowerCase().includes(keyword) ||
        student.email.toLowerCase().includes(keyword)
      );
    });
  }, [searchKeyword, students]);

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

      <AdminErrorBanner message={error} className="mt-4" />

      <form
        role="search"
        className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="flex h-[44px] items-center rounded-[14px] border border-[#E4E7EC] px-4">
          <Image
            src="/images/search.svg"
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
          />
          <span className="sr-only">마일리지 사용자 검색</span>
          <input
            type="text"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            placeholder="이름, 이메일, 사용자 ID 검색..."
            className="ml-3 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
          />
        </label>
      </form>

      <PointTable
        students={filteredStudents}
        isLoading={isLoading}
        onDetail={(studentId) => router.push(`/contentadmin/point/${studentId}`)}
        onGive={(student) => openAdjustModal("give", student)}
        onRecall={(student) => openAdjustModal("recall", student)}
      />

      {/* 검색 중에는 현재 페이지 안에서만 필터링되므로, 검색어가 없을 때만 서버 페이지네이션을 노출한다. */}
      {!searchKeyword.trim() && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <PointPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

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
