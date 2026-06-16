import Image from "next/image";
import Link from "next/link";
import { AdminNotice } from "../types";

type NoticeRowProps = {
  notice: AdminNotice;
  onDelete: (noticeId: number) => void;
};

export default function NoticeRow({ notice, onDelete }: NoticeRowProps) {
  return (
    <tr className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
      <td className="truncate px-4 py-5 font-semibold">{notice.displayId}</td>
      <td className="px-4 py-5 text-center">
        <span className="inline-flex max-w-full justify-center truncate rounded-full bg-[#E7F4EC] px-3 py-1 text-[12px] font-bold text-[#439A97]">
          {notice.tagLabel}
        </span>
      </td>
      <td className="min-w-0 py-5 pl-7 pr-4 font-semibold text-[#111827]">
        <span className="block truncate">{notice.title}</span>
      </td>
      <td className="px-4 py-5 text-center text-[#667085]">{notice.createdAt}</td>
      <td className="px-4 py-5">
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`/csadmin/notice/${notice.noticeId}`}
            aria-label={`수정: 공지사항 ${notice.noticeId}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition hover:bg-[#F2F4F7]"
          >
            <Image src="/images/edit.svg" alt="" aria-hidden="true" width={18} height={18} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(notice.noticeId)}
            aria-label={`삭제: 공지사항 ${notice.noticeId}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition hover:bg-[#F2F4F7]"
          >
            <Image src="/images/delete.svg" alt="" aria-hidden="true" width={18} height={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
