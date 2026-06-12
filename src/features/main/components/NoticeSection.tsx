import Link from "next/link";
import NoticeItem from "./NoticeItem";
import { Notice } from "./Types";

const noticeTagConfig = {
  EVENT: {
    label: "이벤트",
    color: "blue",
  },
  NOTICE: {
    label: "공지",
    color: "gray",
  },
  MAINTENANCE: {
    label: "점검",
    color: "indigo",
  },
} as const;

interface NoticeSectionProps {
  notices: Notice[];
}

export default function NoticeSection({ notices }: NoticeSectionProps) {
  return (
    <section className="h-full w-1/2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0A1628]">공지사항</h1>

        <Link
          href="/notice"
          className="cursor-pointer text-sm text-gray-400 transition hover:text-gray-600"
        >
          더보기
          {" >"}
        </Link>
      </header>

      <ul className="divide-y divide-gray-100">
        {notices.map((notice) => {
          const config = noticeTagConfig[notice.tag];

          return (
            <NoticeItem
              key={notice.noticeId}
              category={config.label}
              title={notice.title}
              date={notice.date}
              color={config.color}
            />
          );
        })}
      </ul>
    </section>
  );
}