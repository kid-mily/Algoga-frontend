import Link from 'next/link';
import NoticeItem from './NoticeItem'
import { getMainNotices } from '@/features/services/notice.service'

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

export default async function NoticeSection() {
  const notices = await getMainNotices();

  return (
    <section className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#0A1628]">
          공지사항
        </h2>

        <Link href="/notice" 
        className="text-sm text-gray-400 hover:text-gray-600 transition">
          더보기
        </Link>
      </div>

      <ul className="divide-y divide-gray-100">
        {notices.map((notice) => {
          const config = noticeTagConfig[notice.tag];

          if (!config) return null;

          return (
            <NoticeItem
              key={notice.noticeId}
              noticeId={notice.noticeId}
              category={config.label}
              title={notice.title}
              date={notice.date}
              color={config.color}
            />
          );
        })}
      </ul>
    </section>
  )
}