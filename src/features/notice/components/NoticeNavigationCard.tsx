import Link from "next/link";
import { NoticeNavigation } from "./types";

interface NoticeNavigationCardProps {
  label: "이전 글" | "다음 글";
  notice?: NoticeNavigation | null;
}

export default function NoticeNavigationCard({
  label,
  notice,
}: NoticeNavigationCardProps) {
  const isPrevious = label === "이전 글";

  if (!notice) {
    return (
      <div className="flex min-h-14 items-center border-b border-[#EEF2F6] px-6 py-4 last:border-b-0">
        <span className="w-20 shrink-0 text-sm font-semibold text-[#94A3B8]">
          {label}
        </span>

        <span className="text-sm text-[#CBD5E1]">
          {isPrevious ? "이전 글이 없습니다." : "다음 글이 없습니다."}
        </span>
      </div>
    );
  }

  return (
    <Link
      href={`/notice/${notice.noticeId}`}
      className="flex min-h-14 items-center border-b border-[#EEF2F6] px-6 py-4 transition hover:bg-[#F8FAFC] last:border-b-0"
    >
      <span className="w-20 shrink-0 text-sm font-semibold text-[#64748B]">
        {label}
      </span>

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#0A1628]">
        {notice.title}
      </span>
    </Link>
  );
}