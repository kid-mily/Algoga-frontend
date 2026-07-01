import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import NoticeDetailCard from "@/features/notice/components/NoticeDetailCard";
import NoticeNavigationCard from "@/features/notice/components/NoticeNavigationCard";
import { getNoticeDetail, getNoticeNavigation } from "@/features/services/notice.service";
import { Metadata } from "next";


export async function generateMetadata({
  params,
}: NoticeDetailPageProps): Promise<Metadata> {
  const { noticeId } = await params;
  const parsedNoticeId = Number(noticeId);

  if (!Number.isInteger(parsedNoticeId) || parsedNoticeId <= 0) {
    return {
      title: "공지사항",
      description: "ALGOGA의 새로운 소식과 공지사항을 확인하세요.",
    };
  }

  const notice = await getNoticeDetail(parsedNoticeId);

  if (!notice) {
    return {
      title: "공지사항",
      description: "ALGOGA의 새로운 소식과 공지사항을 확인하세요.",
    };
  }

  const description =
    notice.content?.replace(/<[^>]*>/g, "").slice(0, 150) ||
    "ALGOGA 공지사항을 확인하세요.";

  return {
    title: notice.title,
    description,
    openGraph: {
      title: `${notice.title} | ALGOGA`,
      description,
      url: `/notice/${noticeId}`,
      images: [
        {
          url: "/images/og-image.png",
          width: 1100,
          height: 740,
          alt: notice.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${notice.title} | ALGOGA`,
      description,
      images: ["/images/og-image.png"],
    },
  };
}

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
      <section className="mx-auto w-full max-w-4xl">
        <Link
          href="/notice?tag=ALL&page=1"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#439A97] transition hover:text-[#357F7C]"
        >
          <ArrowLeft size={16} />
          목록으로
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