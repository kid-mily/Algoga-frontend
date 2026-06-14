import type { Metadata } from "next";
import NoticeFormClient from "@/features/csadmin/notice/components/NoticeFormClient";

export const metadata: Metadata = {
  title: "공지사항 등록 | 알고가 CS 관리자",
  description: "CS 관리자가 새 공지사항의 제목, 내용, 태그를 등록합니다.",
};

export default function NoticeCreatePage() {
  return <NoticeFormClient mode="create" />;
}
