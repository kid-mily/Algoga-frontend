import type { Metadata } from "next";
import PackageManageClient from "@/features/contentmanage/package/components/PackageManageClient";

export const metadata: Metadata = {
  title: "패키지 관리 | 알고가 관리자",
  description: "등록된 패키지 상품을 조회, 검색, 등록, 수정, 삭제하는 콘텐츠 관리자 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PackagePage() {
  return <PackageManageClient />;
}
