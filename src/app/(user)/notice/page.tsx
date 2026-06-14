import Link from "next/link";
import NoticeAllItem from "@/features/notice/components/NoticeAllItem";
import { getNoticeList } from "@/features/services/notice.service";
import {
  isNoticeType,
  noticeTypeConfig,
  noticeTypes,
} from "@/features/notice/components/types";

export const revalidate = 1800;

// 한 페이지에 표시할 공지 개수
const PAGE_SIZE = 10;

interface NoticePageProps {
  searchParams?: Promise<{
    tag?: string;
    page?: string;
  }>;
}

export default async function NoticePage({
  searchParams,
}: NoticePageProps) {
  const params = await searchParams;

  const currentTag = isNoticeType(params?.tag)
    ? params.tag
    : "ALL";

  const pageParam = Number(params?.page);

  const requestedPage =
    Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : 1;

  // 백엔드에서 전체 공지 목록 조회
  const allNotices = await getNoticeList(currentTag);

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(
    allNotices.length / PAGE_SIZE
  );

  // 존재하지 않는 페이지 접근 방지
  const currentPage =
    totalPages > 0
      ? Math.min(requestedPage, totalPages)
      : 1;

  // 현재 페이지에서 시작할 배열 위치
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  // 현재 페이지에 보여줄 공지만 추출
  const notices = allNotices.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // 페이지 번호 생성
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const createNoticeUrl = (
    tag: string,
    page: number
  ) => `/notice?tag=${tag}&page=${page}`;

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-10">
      <section className="mx-auto w-full max-w-4xl">
        <header className="mb-5">
          <h1 className="text-xl font-bold text-[#0A1628]">
            공지사항
          </h1>

          <p className="mt-1 text-sm text-[#8FA0B2]">
            알고가의 새로운 소식을 확인하세요
          </p>
        </header>

        {/* 공지 유형 필터 */}
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
                aria-current={
                  isActive ? "page" : undefined
                }
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

        {/* 공지 목록 */}
        <ul className="overflow-hidden rounded-2xl border border-[#E5EDF5] bg-white shadow-sm">
          {notices.length > 0 ? (
            notices.map((notice) => (
              <NoticeAllItem
                key={notice.noticeId}
                notice={notice}
              />
            ))
          ) : (
            <li className="px-6 py-14 text-center text-sm text-[#94A3B8]">
              등록된 공지사항이 없습니다.
            </li>
          )}
        </ul>

        {/* 페이지네이션 */}
        <nav
          aria-label="공지사항 페이지 이동"
          className="mt-6 flex items-center justify-center gap-2"
        >
          {/* 이전 버튼 */}
          {hasPrevious ? (
            <Link
              href={createNoticeUrl(
                currentTag,
                currentPage - 1
              )}
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

          {/* 페이지 번호 */}
          {pageNumbers.map((pageNumber) => {
            const isActive =
              pageNumber === currentPage;

            return (
              <Link
                key={pageNumber}
                href={createNoticeUrl(
                  currentTag,
                  pageNumber
                )}
                aria-current={
                  isActive ? "page" : undefined
                }
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

          {/* 다음 버튼 */}
          {hasNext ? (
            <Link
              href={createNoticeUrl(
                currentTag,
                currentPage + 1
              )}
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
      </section>
    </main>
  );
}