"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentItem from "@/features/contentmanage/point/StudentItem";
import GiveForm from "@/features/contentmanage/point/GiveForm";
import RecallForm from "@/features/contentmanage/point/RecallForm";
import CompleteModal from "@/features/common/CompleteModal";
import { getStudentsPoints, givePoints, recallPoints, StudentPointInfo } from "@/features/services/adminPoint.service";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import LoadingSpinner from "@/features/common/LoadingSpinner";

export default function PointPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentPointInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [openGive, setOpenGive] = useState(false);
  const [openRecall, setOpenRecall] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [completeText, setCompleteText] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<{ userId: number; name: string; point: number; } | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await getStudentsPoints();
      setStudents(data);
    } catch (error: any) {
      setPageError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGivePoints = async (amount: number, reason: string) => {
    if (!selectedStudent) return false;
    try {
      await givePoints({ userId: selectedStudent.userId, amount, reason });
      setOpenGive(false);
      setCompleteText("마일리지가 성공적으로 지급되었습니다.");
      setCompleteOpen(true);
      fetchStudents(); 
      return true;
    } catch (error: any) {
      setPageError(error.message);
      setOpenGive(false);
      return false;
    }
  };

  const handleRecallPoints = async (amount: number, reason: string) => {
    if (!selectedStudent) return false;
    try {
      await recallPoints({ userId: selectedStudent.userId, amount, reason });
      setOpenRecall(false);
      setCompleteText("마일리지가 성공적으로 회수되었습니다.");
      setCompleteOpen(true);
      fetchStudents(); 
      return true;
    } catch (error: any) {
      setPageError(error.message);
      setOpenRecall(false);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SimpleSubHeader title="마일리지 관리" description="사용자 마일리지를 조회하고 지급합니다" />

      {pageError && <div className="mt-4 p-4 text-red-600 bg-red-50 rounded-lg font-medium">🚨 {pageError}</div>}

      <div className="mt-5 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr] border-b border-[#E4E7EC] bg-[#FCFCFD] px-6 py-4 font-semibold text-[#667085]">
          <div>사용자</div>
          <div>보유 마일리지</div>
          <div>상세 정보</div>
          <div className="text-center">액션</div>
        </div>

        {isLoading ? (
          // 로딩 중일 때 LoadingSpinner 컴포넌트 호출
          <LoadingSpinner text="학생 정보를 불러오는 중입니다..." />
        ) : (
          students.map((student) => (
            <StudentItem
              key={student.userId}
              name={student.userName}
              email={student.email}
              point={student.totalPoint}
              updatedAt="상세 내역 확인 ➔"
              onClick={() => router.push(`/contentadmin/point/${student.userId}`)}
              onGive={() => { setSelectedStudent({ userId: student.userId, name: student.userName, point: student.totalPoint }); setOpenGive(true); }}
              onTake={() => { setSelectedStudent({ userId: student.userId, name: student.userName, point: student.totalPoint }); setOpenRecall(true); }}
            />
          ))
        )}
      </div>

      <GiveForm open={openGive} studentName={selectedStudent?.name || ""} currentPoint={selectedStudent?.point || 0} onClose={() => setOpenGive(false)} onSubmit={handleGivePoints} />
      <RecallForm open={openRecall} studentName={selectedStudent?.name || ""} currentPoint={selectedStudent?.point || 0} onClose={() => setOpenRecall(false)} onSubmit={handleRecallPoints} />
      <CompleteModal open={completeOpen} title="처리 완료" description={completeText} buttonText="확인" onConfirm={() => setCompleteOpen(false)} />
    </div>
  );
}