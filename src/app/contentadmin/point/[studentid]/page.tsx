"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SubHeader from "@/features/contentmanage/common/SubHeader";

// 🌟 실제 API 함수 호출
import { getPointHistory, PointHistory } from "@/features/services/adminPoint.service";

export default function PointDetailPage() {
  const params = useParams();
  const studentid = Number(params.studentid);

  const [logs, setLogs] = useState<PointHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setApiError("");
        const data = await getPointHistory(studentid);
        setLogs(data);
      } catch (error: any) {
        setApiError(error.message || "상세 내역을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (studentid) {
      fetchHistory();
    }
  }, [studentid]);

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader backHref="/contentadmin/point" backText="마일리지 목록으로 돌아가기" title={`마일리지 상세 사용 내역 (유저 ID: ${studentid})`} />

      {/* 🌟 에러 발생 시 빨간 박스 출력 */}
      {apiError && (
        <div className="mt-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]">
          🚨 {apiError}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white">
        <div className="flex items-center justify-between border-b border-[#E4E7EC] px-6 py-5">
          <h2 className="text-[20px] font-bold text-[#111827]">사용 내역</h2>
        </div>

        <div className="grid grid-cols-[1fr_1fr_1fr_2fr] border-b border-[#E4E7EC] bg-[#FCFCFD] px-6 py-4 text-[14px] font-semibold text-[#667085]">
          <div>일시</div>
          <div>유형</div>
          <div>금액</div>
          <div>사유</div>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-[14px] text-[#667085]">내역을 불러오는 중입니다...</div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center text-[14px] text-[#667085]">마일리지 내역이 없습니다.</div>
        ) : (
          logs.map((log) => {
            // 백엔드 명세에 따라 "GIVE", "EARN" 등 적립을 의미하는 문자열 판별
            const isPlus = log.type === "GIVE" || log.type === "EARN" || log.type === "적립";
            
            return (
              <div key={log.pointId || log.mileageId} className="grid grid-cols-[1fr_1fr_1fr_2fr] items-center border-b border-[#E4E7EC] px-6 py-5">
                <div className="flex items-center gap-2 text-[15px] text-[#667085]">
                  <img src="/images/calendar.svg" alt="달력" className="h-[15px] w-[15px]" />
                  {/* 날짜 포맷은 백엔드에서 오는 데이터 형태에 따라 앞 10자리만 자르기 등 추가 가능 */}
                  {log.createdAt ? log.createdAt.substring(0, 10) : "-"}
                </div>

                <div className={`text-[15px] font-semibold ${isPlus ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                  {isPlus ? "지급 (적립)" : "사용 (회수)"}
                </div>

                <div className={`text-[18px] font-bold ${isPlus ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                  {isPlus ? "+" : "-"}
                  {log.amount.toLocaleString()}원
                </div>

                <div className="text-[15px] text-[#344054]">
                  {log.reason}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}