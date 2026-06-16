import Link from "next/link";

interface LectureHeaderProps {
  title: string;
  description: string;
}

export default function LectureHeader({
  title,
  description,
}: LectureHeaderProps) {
  return (
    <div className="border-b border-[#E4E7EC] bg-white px-6 py-5">
      {/* 상단 영역 */}
      <div className="flex items-start gap-3">
        {/* 닫기 버튼 */}
        <Link
          href="/contentadmin/lecture"
          className="text-[20px] text-[#667085] transition hover:text-[#111827]"
        >
          <img src="/images/close.svg" alt="닫기"/>
        </Link>
        {/* 텍스트 */}
        <div>
          {/* 제목 */}
          <h1 className="text-[20px] font-bold text-[#111827]">
            {title}
          </h1>
          {/* 설명 */}
          <p className="mt-1 text-[13px] text-[#98A2B3]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}