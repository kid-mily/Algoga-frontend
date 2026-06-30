import { CalendarDays } from "lucide-react";
import { formatNoticeDate } from "./noticeDate";
import { NoticeDetail, noticeTypeConfig } from "./types";

interface NoticeDetailCardProps {
  notice: NoticeDetail;
}

export default function NoticeDetailCard({ notice }: NoticeDetailCardProps) {
  const typeConfig = noticeTypeConfig[notice.tag];

  return (
    <article className="overflow-hidden rounded-[20px] border border-[#E4EBF3] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <header className="border-b border-[#E4EBF3] bg-[#FAFCFE] px-6 py-6 sm:px-8">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${typeConfig.style}`}
        >
          {typeConfig.label}
        </span>

        <h1 className="mt-4 text-2xl font-bold leading-snug text-[#0A1628]">
          {notice.title}
        </h1>

        <time
          dateTime={notice.createdAt}
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#8A94A6]"
        >
          <CalendarDays size={15} />
          {formatNoticeDate(notice.createdAt)}
        </time>
      </header>

      <div className="min-h-52 px-6 py-7 sm:px-8 sm:py-8">
        <p className="whitespace-pre-wrap break-words text-[15px] leading-8 text-[#263446]">
          {notice.content}
        </p>
      </div>
    </article>
  );
}