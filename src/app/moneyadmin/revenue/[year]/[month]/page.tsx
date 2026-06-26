import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RevenueDetailClient from "@/features/moneyadmin/revenue/components/RevenueDetailClient";

type MoneyAdminRevenueDetailPageProps = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export const metadata: Metadata = {
  title: "월별 수익 상세 | 알고가 정산 관리자",
  description: "정산 관리자가 특정 월의 일별 수익과 결제 내역을 조회하는 화면입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MoneyAdminRevenueDetailPage({
  params,
}: MoneyAdminRevenueDetailPageProps) {
  const { year: yearParam, month: monthParam } = await params;
  const year = Number(yearParam);
  const month = Number(monthParam);

  if (
    !Number.isSafeInteger(year) ||
    !Number.isSafeInteger(month) ||
    year < 2000 ||
    month < 1 ||
    month > 12
  ) {
    notFound();
  }

  return <RevenueDetailClient year={year} month={month} />;
}
