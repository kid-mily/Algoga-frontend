import { LucideIcon } from "lucide-react";

export type SalesOverviewPeriod = "today" | "thisWeek" | "thisMonth" | "thisYear";

export type SalesOverviewSummary = {
  netSales: number;
  receivableAmount: number;
  refundRate: number;
  balanceConversionRate: number;
  netSalesChangeRate: number;
  receivableChangeRate: number;
  refundRateChange: number;
  balanceConversionRateChange: number;
};

export type SalesOverviewMonthlyStat = {
  month: string;
  grossSales: number;
  refundAmount: number;
  netSales: number;
  refundRate: number;
  changeRate: number | null;
};

export type SalesOverview = SalesOverviewSummary & {
  monthlyStats: SalesOverviewMonthlyStat[];
};

export type SalesOverviewQuery = {
  from: string;
  to: string;
};

// 차트 전용 추이 API (overview/trend). 기간 버튼에 맞춰 unit을 바꿔 보냅니다.
export type SalesTrendUnit = "HOUR" | "DAY" | "MONTH";

export type SalesTrendPoint = {
  label: string;
  totalRevenue: number;
  refund: number;
  netRevenue: number;
};

export type SalesOverviewLineChartProps = {
  trend: SalesTrendPoint[];
};

export type ChartDatum = {
  label: string;
  "총매출": number;
  "순매출": number;
  "환불": number;
};

export type SummaryCard = {
  label: string;
  value: string;
  delta: string;
  deltaTone: "positive" | "negative";
  icon: LucideIcon;
  iconTone: string;
};

export type SalesOverviewSummaryCardsProps = {
  summary: SalesOverviewSummary;
};

export type SalesOverviewTableProps = {
  monthlyStats: SalesOverviewMonthlyStat[];
};