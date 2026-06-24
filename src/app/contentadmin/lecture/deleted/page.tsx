import type { Metadata } from "next";
import DeletedLectureManageClient from "@/features/contentmanage/lecture/components/DeletedLectureManageClient";

export const metadata: Metadata = {
  title: "삭제 강의 목록 | 콘텐츠 관리자",
  description: "삭제 처리된 강의 목록을 조회합니다.",
};

export default function DeletedLecturePage() {
  return <DeletedLectureManageClient />;
}