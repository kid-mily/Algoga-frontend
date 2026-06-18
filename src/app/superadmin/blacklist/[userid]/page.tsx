import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlacklistDetailClient from "@/features/superadmin/blacklist/components/BlacklistDetailClient";

type SuperAdminBlacklistDetailPageProps = {
  params: Promise<{ userid: string }>;
};

export const metadata: Metadata = {
  title: "블랙리스트 후보 상세 | 알고가 슈퍼 관리자",
  description:
    "슈퍼 관리자가 블랙리스트 후보 유저의 상세 정보와 신고 이력을 조회하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SuperAdminBlacklistDetailPage({
  params,
}: SuperAdminBlacklistDetailPageProps) {
  const { userid } = await params;
  const userId = Number(userid);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    notFound();
  }

  return <BlacklistDetailClient userId={userId} />;
}
