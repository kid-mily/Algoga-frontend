import type { Metadata } from "next";
import ReviewManageClient from "@/features/contentmanage/review/components/ReviewManageClient";

export const metadata: Metadata = {
  title: "후기 관리 | 알고가 관리자",
  description:
    "강의 수료 학생의 후기와 평점을 검색, 필터링하고 관리자 화면에서 관리합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReviewPage() {
  return <ReviewManageClient />;
}
