import { AdminPayment } from "@/features/moneyadmin/payment/types";

export type MonthlyRevenueStat = {
  year: number;
  month: number;
  totalAmount: number;
  refundAmount: number;
  netAmount: number;
  count: number;
  growthRate: number;
};

export type DailyRevenueStat = {
  day: number;
  salesAmount: number;
  refundAmount: number;
  netAmount: number;
};

export type MonthlyRevenueDetail = MonthlyRevenueStat & {
  dailyStats: DailyRevenueStat[];
};

export type RevenueDetailData = {
  detail: MonthlyRevenueDetail;
  payments: AdminPayment[];
};
