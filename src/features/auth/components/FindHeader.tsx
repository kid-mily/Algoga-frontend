import Link from "next/link";
import { AuthPageHeaderProps } from "../types"

export default function AuthPageHeader({
  title,
  description,
  backText = "로그인으로 돌아가기",
}: AuthPageHeaderProps) {
  return (
    <div>
      {/* 뒤로가기 */}
      <Link
        href="/auth/login"
        className="flex items-center gap-2 text-[15px] text-[#98A2B3]"
      >
        <span>‹</span>
        {backText}
      </Link>

      {/* 제목 */}
      <h1 className="mt-9 text-[30px] font-bold text-[#111827]">
        {title}
      </h1>

      {/* 설명 */}
      <p className="mt-3 text-[18px] text-[#98A2B3]">
        {description}
      </p>
    </div>
  );
}