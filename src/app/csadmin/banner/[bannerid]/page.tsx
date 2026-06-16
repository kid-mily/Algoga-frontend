import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BannerFormClient from "@/features/csadmin/banner/components/BannerFormClient";

type EditBannerPageProps = {
  params: Promise<{ bannerid: string }>;
};

export const metadata: Metadata = {
  title: "배너 수정 | 알고가 CS 관리자",
  description: "메인 배너 정보를 수정하는 CS 관리자 페이지입니다.",
};

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { bannerid } = await params;

  if (!/^\d+$/.test(bannerid)) {
    notFound();
  }

  const bannerId = Number(bannerid);

  if (!Number.isSafeInteger(bannerId) || bannerId <= 0) {
    notFound();
  }

  return <BannerFormClient mode="edit" bannerId={bannerId} />;
}
