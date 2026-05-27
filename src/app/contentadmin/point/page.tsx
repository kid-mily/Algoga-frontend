"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import SubHeader from "@/features/contentmanage/SubHeader";

import StudentItem from "@/features/contentmanage/point/StudentItem";
import PointItem from "@/features/contentmanage/point/PointItem";

import GiveForm from "@/features/contentmanage/point/GiveForm";
import RecallForm from "@/features/contentmanage/point/RecallForm";

import {
  students,
  pointLogs,
} from "@/features/contentmanage/MockData";

export default function PointPage() {

  const router = useRouter();

  // 지급 모달
  const [openGive, setOpenGive] =
    useState(false);

  // 회수 모달
  const [openRecall, setOpenRecall] =
    useState(false);

  // 선택된 학생
  const [
    selectedStudent,
    setSelectedStudent,
  ] = useState<{
    name: string;
    point: number;
  } | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">

      {/* 헤더 */}
      <SubHeader
        backHref="/contentadmin"
        backText="메인페이지로 돌아가기"
        title="마일리지 관리"
        description="사용자 마일리지를 조회하고 지급합니다"
      />

      {/* 검색 */}
      <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-4">

        <div className="flex h-[42px] items-center rounded-[12px] border border-[#E4E7EC] px-3">

          <img
            src="/images/search.svg"
            alt="검색"
            className="h-[16px] w-[16px]"
          />

          <input
            type="text"
            placeholder="uuid, 사용자 이름, 이메일 검색..."
            className="ml-2 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>
      </div>

      {/* 사용자 마일리지 */}
      <div className="mt-5 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">

        {/* 헤더 */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr] border-b border-[#E4E7EC] bg-[#FCFCFD] px-6 py-4 text-[14px] font-semibold text-[#667085]">
          <div>사용자</div>
          <div>보유 마일리지</div>
          <div>최근 업데이트</div>
          <div className="text-center">
            액션
          </div>
        </div>

        {/* 리스트 */}
        {students.map((student) => (

          <StudentItem
            key={student.id}
            name={student.name}
            email={student.email}
            point={student.point}
            updatedAt={student.updatedAt}
            // 지급
            onGive={() => {
              setSelectedStudent({
                name: student.name,
                point: student.point,
              });

              setOpenGive(true);
            }}

            // 회수
            onTake={() => {

              setSelectedStudent({
                name: student.name,
                point: student.point,
              });
              setOpenRecall(true);
            }}
          />
        ))}
      </div>

      {/* 지급/사용 내역 */}
      <div className="mt-7 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">
        {/* 제목 */}
        <div className="border-b border-[#E4E7EC] px-6 py-5">
          <h2 className="text-[18px] font-bold text-[#111827]">
            최근 지급/사용 내역
          </h2>
        </div>

        {/* 헤더 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_2fr_1fr_1fr_1fr] border-b border-[#E4E7EC] bg-[#FCFCFD] px-6 py-4 text-[14px] font-semibold text-[#667085]">
          <div>사용자</div>
          <div>유형</div>
          <div>금액</div>
          <div>사유</div>
          <div>처리자</div>
          <div>일시</div>
          <div className="text-center">
            상세
          </div>
        </div>

        {/* 리스트 */}
        {pointLogs.map((log) => (

          <PointItem
            key={log.id}
            name={log.name}
            type={
              log.type as
                | "적립"
                | "사용"
            }
            amount={log.amount}
            reason={log.reason}
            manager={log.manager}
            createdAt={log.createdAt}
            onDetail={() =>
              router.push(
                `/contentadmin/point/${log.id}`
              )
            }
          />
        ))}
      </div>

      {/* 지급 모달 */}
      <GiveForm
        open={openGive}
        studentName={
          selectedStudent?.name || ""
        }
        currentPoint={
          selectedStudent?.point || 0
        }
        onClose={() =>
          setOpenGive(false)
        }
        onSubmit={(
          amount,
          reason
        ) => {

          console.log(
            "지급",
            amount,
            reason
          );

          setOpenGive(false);
        }}
      />

      {/* 회수 모달 */}
      <RecallForm
        open={openRecall}
        studentName={
          selectedStudent?.name || ""
        }
        currentPoint={
          selectedStudent?.point || 0
        }
        onClose={() =>
          setOpenRecall(false)
        }
        onSubmit={(
          amount,
          reason
        ) => {

          console.log(
            "회수",
            amount,
            reason
          );
          setOpenRecall(false);
        }}
      />
    </div>
  );
}