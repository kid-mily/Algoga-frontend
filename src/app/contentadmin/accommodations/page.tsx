import type { Metadata } from "next";
import AccommodationManageClient from "@/features/contentmanage/package/components/AccommodationManageClient";

export const metadata: Metadata = {
  title: "숙소 관리 | 알고가 관리자",
  description: "패키지 구성에 사용할 숙소를 국가별로 조회, 등록, 수정, 삭제합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccommodationsPage() {
  return <AccommodationManageClient />;
}
