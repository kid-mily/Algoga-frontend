import CountryProfitabilitySummaryClient from "@/features/statisticadmin/country-profitability-summary/components/CountryProfitabilitySummaryClient";

export const metadata = {
  title: "나라별 수익성 종합 | 알고가 통계 관리자",
  description: "통계 관리자가 나라별 수익성을 확인하는 화면입니다.",
};

export default function CountryProfitabilitySummaryPage() {
  return <CountryProfitabilitySummaryClient />;
}