// 공지사항 전체 조회

import Link from "next/link";
import NoticeAllItem from "@/features/notice/components/NoticeAllItem";
import { getNoticeList } from "@/features/services/notice.service";
import { isNoticeType, noticeTypeConfig, noticeTypes } from "@/features/notice/components/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "공지사항",
  description: "ALGOGA의 새로운 소식과 공지사항을 확인하세요.",
  openGraph: {
    title: "공지사항 | ALGOGA",
    description: "ALGOGA의 새로운 소식과 공지사항을 확인하세요.",
    url: "/notice",
    images: [
      {
        url: "/images/og-image.png",
        width: 1100,
        height: 740,
        alt: "ALGOGA 공지사항",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "공지사항 | ALGOGA",
    description: "ALGOGA의 새로운 소식과 공지사항을 확인하세요.",
    images: ["/images/og-image.png"],
  },
};

interface NoticePageProps {
  searchParams?: Promise<{
    tag?: string;
    page?: string;
  }>;
}

export default async function NoticePage({ searchParams }: NoticePageProps) {
  const params = await searchParams;

  const currentTag = isNoticeType(params?.tag) ? params.tag : "ALL";

  const pageParam = Number(params?.page);
  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const noticePage = await getNoticeList(currentTag, currentPage);

  const notices = noticePage.content;
  const totalPages = noticePage.totalPages;

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const hasPrevious = !noticePage.first && currentPage > 1;
  const hasNext = !noticePage.last && totalPages > 0;

  const createNoticeUrl = (tag: string, page: number) => {
    return `/notice?tag=${tag}&page=${page}`;
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-10">
      <section className="mx-auto w-full max-w-4xl">
        <header className="mb-5">
          <h1 className="text-xl font-bold text-[#0A1628]">
            공지사항
          </h1>

          <p className="mt-1 text-sm text-[#8FA0B2]">
            알고가의 새로운 소식을 확인하세요.
          </p>
        </header>

        <nav
          aria-label="공지사항 분류"
          className="mb-4 flex flex-wrap gap-2"
        >
          {noticeTypes.map((type) => {
            const isActive = currentTag === type;

            return (
              <Link
                key={type}
                href={createNoticeUrl(type, 1)}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#43A6A2] text-white"
                    : "border border-[#E5EDF5] bg-white text-[#64748B] hover:bg-[#EAF7F6] hover:text-[#2F8F8B]"
                }`}
              >
                {noticeTypeConfig[type].label}
              </Link>
            );
          })}
        </nav>

        <ul className="overflow-hidden rounded-2xl border border-[#E5EDF5] bg-white shadow-sm">
          {notices.length > 0 ? (
            notices.map((notice) => (
              <NoticeAllItem key={notice.noticeId} notice={notice} />
            ))
          ) : (
            <li className="px-6 py-14 text-center text-sm text-[#94A3B8]">
              등록된 공지사항이 없습니다.
            </li>
          )}
        </ul>

        {totalPages > 0 && (
          <nav
            aria-label="공지사항 페이지 이동"
            className="mt-6 flex items-center justify-center gap-2"
          >
            {hasPrevious ? (
              <Link
                href={createNoticeUrl(currentTag, currentPage - 1)}
                className="flex h-10 min-w-16 items-center justify-center rounded-lg border border-[#E5EDF5] bg-white px-4 text-sm font-semibold text-[#64748B] shadow-sm transition hover:bg-[#EAF7F6] hover:text-[#2F8F8B]"
              >
                이전
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="flex h-10 min-w-16 cursor-not-allowed items-center justify-center rounded-lg border border-[#EDF2F7] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#CBD5E1]"
              >
                이전
              </span>
            )}

            {pageNumbers.map((pageNumber) => {
              const isActive = pageNumber === currentPage;

              return (
                <Link
                  key={pageNumber}
                  href={createNoticeUrl(currentTag, pageNumber)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold shadow-sm transition ${
                    isActive
                      ? "bg-[#43A6A2] text-white"
                      : "border border-[#E5EDF5] bg-white text-[#64748B] hover:bg-[#EAF7F6] hover:text-[#2F8F8B]"
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}

            {hasNext ? (
              <Link
                href={createNoticeUrl(currentTag, currentPage + 1)}
                className="flex h-10 min-w-16 items-center justify-center rounded-lg border border-[#E5EDF5] bg-white px-4 text-sm font-semibold text-[#64748B] shadow-sm transition hover:bg-[#EAF7F6] hover:text-[#2F8F8B]"
              >
                다음
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="flex h-10 min-w-16 cursor-not-allowed items-center justify-center rounded-lg border border-[#EDF2F7] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#CBD5E1]"
              >
                다음
              </span>
            )}
          </nav>
        )}
      </section>
    </main>
  );
}