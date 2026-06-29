import Link from "next/link";
import NoticeList from "./NoticeList";
import { getMainNotices } from "@/features/services/notice.service";
import type { MainNoticeSourceNotice } from "../types";

export default async function NoticeSection() {
  let notices: MainNoticeSourceNotice[] = [];

  try {
    notices = await getMainNotices();
  } catch (error) {
    console.error("[main-notice] 메인 공지 조회 실패:", error);
    notices = [];
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0A1628]">공지사항</h2>

        <Link
          href="/notice"
          className="text-sm text-gray-400 transition hover:text-gray-600"
        >
          더보기
        </Link>
      </div>

      <NoticeList notices={notices} />
    </section>
  );
}