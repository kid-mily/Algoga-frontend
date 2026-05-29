"use client";

import { useParams } from "next/navigation";

import SubHeader from "@/features/contentmanage/SubHeader";

import {
  students,
  pointLogs,
} from "@/features/contentmanage/MockData";

export default function PointDetailPage() {

  const params = useParams();

  const studentid =
    Number(params.studentid);

  // 학생 찾기
  const student =
    students.find(
      (item) =>
        item.id === studentid
    );
  // 해당 학생 내역
  const logs =
    pointLogs.filter(
      (item) =>
        item.name ===
        student?.name
    );

  if (!student) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      {/* 헤더 */}
      <SubHeader
        backHref="/contentadmin/point"
        backText="마일리지 목록으로 돌아가기"
        title={`${student.name}님 마일리지 사용내역`}
      />

      {/* 내역 */}
      <div className="mt-6 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">

        {/* 상단 */}
        <div className="flex items-center justify-between border-b border-[#E4E7EC] px-6 py-5">
          <h2 className="text-[20px] font-bold text-[#111827]">
            사용 내역
          </h2>
        </div>

        {/* 헤더 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_2fr] border-b border-[#E4E7EC] bg-[#FCFCFD] px-6 py-4 text-[14px] font-semibold text-[#667085]">
          <div>일시</div>
          <div>유형</div>
          <div>금액</div>
          <div>사유</div>
        </div>

        {/* 리스트 */}
        {logs.map((log) => {
          const isPlus =
            log.type === "적립";
          return (
            <div
              key={log.id}
              className="grid grid-cols-[1fr_1fr_1fr_2fr] items-center border-b border-[#E4E7EC] px-6 py-5"
            >
              {/* 날짜 */}
              <div className="flex items-center gap-2 text-[15px] text-[#667085]">
                <img
                  src="/images/calendar.svg"
                  alt="달력"
                  className="h-[15px] w-[15px]"
                />
                {log.createdAt}
              </div>

              {/* 유형 */}
              <div
                className={`text-[15px] font-semibold ${
                  isPlus
                    ? "text-[#16A34A]"
                    : "text-[#DC2626]"
                }`}
              >
                {log.type}
              </div>

              {/* 금액 */}
              <div
                className={`text-[18px] font-bold ${
                  isPlus
                    ? "text-[#16A34A]"
                    : "text-[#DC2626]"
                }`}
              >
                {isPlus ? "+" : "-"}
                {log.amount.toLocaleString()}원
              </div>

              {/* 사유 */}
              <div className="text-[15px] text-[#344054]">
                {log.reason}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


