import Link from "next/link";

interface ContentSubHeaderProps {
  backHref: string;
  backText: string;

  title: string;
  description?: string;
}

export default function SubHeader({
  backHref,
  backText,
  title,
  description,
}: ContentSubHeaderProps) {

  return (
    <div className="mb-6">

      {/* 뒤로가기 */}
      <Link
        href={backHref}
        className="flex items-center gap-2 text-[13px] font-medium text-[#667085] transition hover:text-[#111827]"
      >

        {/* 화살표 */}
        <img
          src="/images/arrow.svg"
          alt="화살표"
          className="h-[14px] w-[14px]"
        />

        {backText}
      </Link>

      {/* 제목 */}
      <h1 className="mt-3 text-[28px] font-bold leading-[1.2] text-[#111827]">
        {title}
      </h1>

      {/* 설명 */}
      {description && (
        <p className="mt-1 text-[15px] font-medium text-[#98A2B3]">
          {description}
        </p>
      )}
    </div>
  );
}