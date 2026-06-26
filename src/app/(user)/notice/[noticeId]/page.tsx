// 공지사항 상세 조회

import Link from "next/link";
import { notFound } from "next/navigation";
import NoticeDetailCard from "@/features/notice/components/NoticeDetailCard";
import NoticeNavigationCard from "@/features/notice/components/NoticeNavigationCard";
import {
  getNoticeDetail,
  getNoticeNavigation,
} from "@/features/services/notice.service";

interface NoticeDetailPageProps {
  params: Promise<{
    noticeId: string;
  }>;
}

export default async function NoticeDetailPage({
  params,
}: NoticeDetailPageProps) {
  const { noticeId } = await params;
  const parsedNoticeId = Number(noticeId);

  if (!Number.isInteger(parsedNoticeId) || parsedNoticeId <= 0) {
    notFound();
  }

  const [notice, navigation] = await Promise.all([
    getNoticeDetail(parsedNoticeId),
    getNoticeNavigation(parsedNoticeId),
  ]);

  if (!notice) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-5 py-10 sm:px-6">
      <section className="mx-auto w-full max-w-3xl">
        <Link
          href="/notice?tag=ALL&page=1"
          className="mb-7 inline-flex text-sm font-semibold text-[#439A97] transition hover:text-[#62B6B7]"
        >
          
          ← 목록으로
        </Link>

        <NoticeDetailCard notice={notice} />

        <nav
          aria-label="이전 및 다음 공지사항"
          className="mt-6 overflow-hidden rounded-2xl border border-[#E4EBF3] bg-white shadow-sm"
        >
          <NoticeNavigationCard
            label="이전 글"
            notice={navigation.previousNotice}
          />

          <NoticeNavigationCard
            label="다음 글"
            notice={navigation.nextNotice}
          />
        </nav>
      </section>
    </main>
  );
}