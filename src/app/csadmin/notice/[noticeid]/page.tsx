import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NoticeFormClient from "@/features/csadmin/notice/components/NoticeFormClient";

type NoticeEditPageProps = {
  params: Promise<{
    noticeid: string;
  }>;
};

export const metadata: Metadata = {
  title: "공지사항 수정 | 알고가 CS 관리자",
  description: "등록된 공지사항의 제목, 내용, 태그를 수정합니다.",
};

export default async function NoticeEditPage({ params }: NoticeEditPageProps) {
  const { noticeid } = await params;

  if (!/^\d+$/.test(noticeid)) {
    notFound();
  }

  const noticeId = Number(noticeid);

  if (!Number.isSafeInteger(noticeId) || noticeId <= 0) {
    notFound();
  }

  return <NoticeFormClient mode="edit" noticeId={noticeId} />;
}
