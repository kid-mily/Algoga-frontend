"use client";

interface CouponItemProps {
  name: string;
  // 🌟 숫자(number) 대신 문자열(string)도 받을 수 있도록 수정했습니다!
  discount: string | number; 
  startDate: string;
  endDate: string;
  lecture: string;
  target: string;
  isActive: boolean;
  createdAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CouponItem({
  name,
  discount,
  startDate,
  endDate,
  lecture,
  target,
  isActive,
  createdAt,
  onEdit,
  onDelete,
}: CouponItemProps) {
  return (
    <div className="grid grid-cols-[2fr_0.7fr_1fr_1.5fr_0.8fr_0.8fr_0.8fr_0.7fr] items-center border-b border-[#E4E7EC] px-5 py-5">
      {/* 이름 */}
      <div className="text-[15px] font-semibold text-[#111827]">
        {name}
      </div>

      {/* 할인율 */}
      <div>
        <div className="inline-flex rounded-full bg-[#EAF7EE] px-3 py-1 text-[13px] font-bold text-[#43A047]">
          {/* 🌟 기존에 있던 % 기호를 지웠습니다. (부모가 '원' 또는 '%'를 붙여서 보내줍니다) */}
          {discount}
        </div>
      </div>

      {/* 기간 */}
      <div className="text-[14px] text-[#667085]">
        <p>{startDate}</p>
        <p>~ {endDate}</p>
      </div>

      {/* 강의 */}
      <div className="text-[15px] font-medium text-[#111827]">
        {lecture}
      </div>

      {/* 적용 대상 */}
      <div>
        <div className="inline-flex rounded-[10px] bg-[#F2F4F7] px-3 py-1 text-[12px] font-semibold text-[#667085]">
          {target}
        </div>
      </div>

      {/* 상태 */}
      <div>
        <div
          className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${
            isActive
              ? "bg-[#EAF7EE] text-[#43A047]"
              : "bg-[#F2F4F7] text-[#667085]"
          }`}
        >
          {isActive ? "사용가능" : "사용불가"}
        </div>
      </div>

      {/* 등록일 */}
      <div className="text-[14px] text-[#667085]">
        {createdAt}
      </div>

      {/* 액션 */}
      <div className="flex items-center justify-center gap-4">
        {/* 수정 */}
        <button
          type="button"
          onClick={onEdit}
          className="transition hover:opacity-60"
        >
          <img
            src="/images/edit.svg"
            alt="수정"
            className="h-[18px] w-[18px]"
          />
        </button>

        {/* 삭제 */}
        <button
          type="button"
          onClick={onDelete}
          className="transition hover:opacity-60"
        >
          <img
            src="/images/delete.svg"
            alt="삭제"
            className="h-[18px] w-[18px]"
          />
        </button>
      </div>
    </div>
  );
}