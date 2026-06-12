import type { Metadata } from "next";
import PackageManageClient from "@/features/contentmanage/package/components/PackageManageClient";

export const metadata: Metadata = {
  title: "패키지 관리 | 알고가 관리자",
  description: "패키지 구성을 위한 숙소를 관리하고 항공편을 검색합니다.",
};

export default function PackagePage() {
  return <PackageManageClient />;
}
