import type { Metadata } from "next";
import BannerFormClient from "@/features/csadmin/banner/components/BannerFormClient";

export const metadata: Metadata = {
  title: "배너 등록 | 알고가 CS 관리자",
  description: "메인 배너를 등록하는 CS 관리자 페이지입니다.",
};

export default function CreateBannerPage() {
  return <BannerFormClient mode="create" />;
}
