import Link from "next/link";
import { NoticeAll, noticeTypeConfig } from "./types";


interface NoticeAllItemProps {
  notice: NoticeAll;
}

const noticeColorStyle = {
  blue: "bg-blue-50 text-blue-600",
  gray: "bg-gray-100 text-gray-600",
  indigo: "bg-indigo-50 text-indigo-600",
} as const;

export default function NoticeAllItem({ notice }: NoticeAllItemProps) {
  const config = noticeTypeConfig[notice.type];

  return (
    <li className="border-b border-[#EEF2F6] last:border-b-0">
      <Link
        href={`/notice/${notice.noticeId}`}
        className="flex items-center gap-3 px-5 py-4 transition hover:bg-[#F8FAFC]"
      >
        <span
          className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold ${
            noticeColorStyle[config.color]
          }`}
        >
          {config.label}
        </span>

        <p className="min-w-0 flex-1 truncate text-sm font-medium text-[#334155]">
          {notice.title}
        </p>

        <time dateTime={notice.date} className="shrink-0 text-xs text-[#94A3B8]">
          {notice.date}
        </time>
      </Link>
    </li>
  );
}