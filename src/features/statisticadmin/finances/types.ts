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

export type SalesOverviewLineChartProps = {
  monthlyStats: SalesOverviewMonthlyStat[];
};

export type ChartDatum = {
  month: string;
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