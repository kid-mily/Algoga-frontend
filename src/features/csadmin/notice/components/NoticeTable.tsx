import Link from "next/link";
import { AdminNotice } from "../types";
import NoticeRow from "./NoticeRow";

type NoticeTableProps = {
  notices: AdminNotice[];
  isLoading: boolean;
  onDelete: (noticeId: number) => void;
};

export default function NoticeTable({ notices, isLoading, onDelete }: NoticeTableProps) {
  return (
    <section
      className="rounded-[16px] border border-[#E4E7EC] bg-white"
      aria-labelledby="notice-table-title"
    >
      <h2 id="notice-table-title" className="sr-only">공지사항 목록</h2>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[14%]" />
            <col className="w-[46%]" />
            <col className="w-[16%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-semibold text-[#344054]">
              <th scope="col" className="px-4 py-4">번호</th>
              <th scope="col" className="px-4 py-4 text-center">태그</th>
              <th scope="col" className="px-4 py-4">제목</th>
              <th scope="col" className="px-4 py-4 text-center">작성일</th>
              <th scope="col" className="px-4 py-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[14px] text-[#667085]">
                  공지사항을 불러오는 중입니다...
                </td>
              </tr>
            ) : notices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[14px] text-[#667085]">
                  조건에 맞는 공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              notices.map((notice) => (
                <NoticeRow key={notice.noticeId} notice={notice} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {isLoading ? (
          <p className="py-8 text-center text-[14px] text-[#667085]">
            공지사항을 불러오는 중입니다...
          </p>
        ) : notices.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[#667085]">
            조건에 맞는 공지사항이 없습니다.
          </p>
        ) : (
          notices.map((notice) => (
            <article key={notice.noticeId} className="rounded-[12px] border border-[#E4E7EC] p-4">
              <header className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-[#439A97]">{notice.displayId}</p>
                  <h3 className="mt-1 font-bold text-[#111827]">{notice.title}</h3>
                </div>
                <span className="rounded-full bg-[#E7F4EC] px-3 py-1 text-[12px] font-bold text-[#439A97]">
                  {notice.tagLabel}
                </span>
              </header>
              <p className="text-[13px] text-[#667085]">{notice.createdAt}</p>
              <footer className="mt-4 flex gap-2">
                <Link
                  href={`/csadmin/notice/${notice.noticeId}`}
                  aria-label={`수정: 공지사항 ${notice.noticeId}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition hover:bg-[#F2F4F7]"
                >
                  <img src="/images/edit.svg" alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(notice.noticeId)}
                  aria-label={`삭제: 공지사항 ${notice.noticeId}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition hover:bg-[#F2F4F7]"
                >
                  <img src="/images/delete.svg" alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
                </button>
              </footer>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
