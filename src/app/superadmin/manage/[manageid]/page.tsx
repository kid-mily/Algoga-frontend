import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ManagerFormClient from "@/features/superadmin/manager/components/ManagerFormClient";

type EditManagerPageProps = {
  params: Promise<{
    manageid: string;
  }>;
};

export const metadata: Metadata = {
  title: "관리자 계정 수정 | 알고가 슈퍼 관리자",
  description: "관리자 계정 정보와 권한을 수정합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditManagerPage({
  params,
}: EditManagerPageProps) {
  const { manageid } = await params;

  if (!/^\d+$/.test(manageid)) {
    notFound();
  }

  const managerId = Number(manageid);

  if (!Number.isSafeInteger(managerId) || managerId <= 0) {
    notFound();
  }

  return <ManagerFormClient mode="edit" managerId={managerId} />;
}
