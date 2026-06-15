import type { Metadata } from "next";
import BannerManageClient from "@/features/csadmin/banner/components/BannerManageClient";

export const metadata: Metadata = {
  title: "배너 관리 | 알고가 CS 관리자",
  description: "메인 배너를 조회, 등록, 수정, 삭제하는 CS 관리자 페이지입니다.",
};

export default function BannerManagePage() {
  return <BannerManageClient />;
}
