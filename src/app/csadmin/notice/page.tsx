import type { Metadata } from "next";
import NoticeManageClient from "@/features/csadmin/notice/components/NoticeManageClient";
import type { AdminNotice } from "@/features/csadmin/notice/types";
import { getAdminNotices } from "@/features/services/adminNotice.service";

export const metadata: Metadata = {
  title: "공지사항 관리 | 알고가 CS 관리자",
  description: "공지사항을 검색, 필터링하고 등록, 수정, 삭제 상태를 관리하는 CS 관리자 화면입니다.",
};

export default async function NoticeManagePage() {
  let notices: AdminNotice[] = [];

  try {
    notices = await getAdminNotices({ tag: "ALL", index: 0 });
  } catch {
    notices = [];
  }

  return <NoticeManageClient initialNotices={notices} />;
}
