import { formatNoticeDate } from "./noticeDate";
import { NoticeDetail, noticeTypeConfig } from "./types";

interface NoticeDetailCardProps {
  notice: NoticeDetail;
}

export default function NoticeDetailCard({
  notice,
}: NoticeDetailCardProps) {
  // 상세 API의 tag에 맞는 라벨과 색상 설정 조회
  const typeConfig = noticeTypeConfig[notice.tag];

  return (
    <article className="overflow-hidden rounded-2xl border border-[#E4EBF3] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      {/* 공지 제목 영역 */}
      <header className="bg-[#EAF3FF] px-8 py-6">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${typeConfig.style}`}
        >
          {typeConfig.label}
        </span>

        <h1 className="mt-5 text-xl font-bold text-[#0A1628]">
          {notice.title}
        </h1>

        <time
          dateTime={notice.createdAt}
          className="mt-3 block text-sm text-[#9AABBA]"
        >
          {formatNoticeDate(notice.createdAt)}
        </time>
      </header>

      {/* 공지 본문 영역 */}
      <div className="min-h-40 px-10 py-9">
        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#0A1628]">
          {notice.content}
        </p>
      </div>
    </article>
  );
}