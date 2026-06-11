import type { Metadata } from "next";
import PointManageClient from "@/features/contentmanage/point/components/PointManageClient";

export const metadata: Metadata = {
  title: "마일리지 관리 | 알고가 관리자",
  description: "사용자 마일리지를 조회하고 지급 또는 회수합니다.",
};

export default function PointPage() {
  return <PointManageClient />;
}
