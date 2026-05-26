"use client";

interface StudentItemProps {
  name: string;
  email: string;
  point: number;
  updatedAt: string;
  onClick?: () => void;
  onGive?: () => void;
  onTake?: () => void;
}

export default function StudentItem({
  name,
  email,
  point,
  updatedAt,

  onClick,
  onGive,
  onTake,
}: StudentItemProps) {

  return (
    <div
      onClick={onClick}
      className="grid cursor-pointer grid-cols-[2fr_2fr_1fr_1fr] items-center border-b border-[#E4E7EC] px-6 py-5 transition"
    >
      {/* 유저 */}
      <div className="flex items-center gap-4">

        {/* 프로필 */}
        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#EAF2FF]">

          <img
            src="/images/users.svg"
            alt="유저"
            className="h-[18px] w-[18px]"
          />
        </div>

        {/* 이름 */}
        <div>
          <p className="text-[16px] font-semibold text-[#111827]">
            {name}
          </p>
          <p className="mt-1 text-[14px] text-[#98A2B3]">
            {email}
          </p>
        </div>
      </div>

      {/* 포인트 */}
      <div className="text-[20px] font-bold text-[#111827]">

        {point.toLocaleString()}원
      </div>

      {/* 날짜 */}
      <div className="flex items-center gap-2 text-[15px] text-[#667085]">

        <img
          src="/images/calendar.svg"
          alt="달력"
          className="h-[16px] w-[16px]"
        />

        {updatedAt}
      </div>

      {/* 액션 */}
      <div className="flex items-center justify-center gap-3">

        {/* 지급 */}
        <button
          type="button"
          onClick={onGive}
          className="h-[36px] rounded-full bg-[#ECFDF3] px-4 text-[13px] font-semibold text-[#16A34A]"
        >
          지급
        </button>

        {/* 회수 */}
        <button
          type="button"
          onClick={onTake}
          className="h-[36px] rounded-full bg-[#FEF2F2] px-4 text-[13px] font-semibold text-[#DC2626]"
        >
          회수
        </button>
      </div>
    </div>
  );
}