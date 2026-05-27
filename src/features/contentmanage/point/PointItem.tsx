"use client";

interface PointItemProps {
  name: string;
  type: "적립" | "사용";
  amount: number;
  reason: string;
  manager: string;
  createdAt: string;
  onDetail?: () => void;
}

export default function PointItem({
  name,
  type,
  amount,
  reason,
  manager,
  createdAt,

  onDetail,
}: PointItemProps) {

  const isPlus =
    type === "적립";

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_2fr_1fr_1fr_1fr] items-center border-b border-[#E4E7EC] px-6 py-5">
      {/* 이름 */}
      <div className="text-[15px] font-semibold text-[#111827]">
        {name}
      </div>

      {/* 타입 */}
      <div>
        <div
          className={`inline-flex rounded-full px-4 py-1 text-[13px] font-semibold ${
            isPlus
              ? "bg-[#ECFDF3] text-[#16A34A]"
              : "bg-[#FEF2F2] text-[#DC2626]"
          }`}
        >
          {type}
        </div>
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
        {amount.toLocaleString()}원
      </div>

      {/* 사유 */}
      <div className="text-[15px] text-[#344054]">
        {reason}
      </div>

      {/* 처리자 */}
      <div className="text-[15px] text-[#667085]">
        {manager}
      </div>

      {/* 날짜 */}
      <div className="flex items-center gap-2 text-[14px] text-[#667085]">
        <img
          src="/images/calendar.svg"
          alt="달력"
          className="h-[15px] w-[15px]"
        />
        {createdAt}</div>

      {/* 상세보기 */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onDetail}
         className="rounded-full bg-[#ECFDF3] px-4 py-2 text-[13px] font-semibold text-[#16A34A]"
        >
          상세보기
        </button>
      </div>
    </div>
  );
}