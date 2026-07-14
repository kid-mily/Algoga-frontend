export type RefundPeriod = "today" | "thisWeek" | "thisMonth" | "thisYear";

export type TrendUnit = "HOUR" | "DAY" | "MONTH";

export type RefundQuery = {
  from: string;
  to: string;
};

export type RefundSummary = {
  refundRate: number;
  netRevenue: number;
  paidCancelCount: number;
  paymentCancelRate: number;
};

export type RefundMonthlyTrend = {
  month: string;
  grossRevenue: number;
  refundAmount: number;
  netRevenue: number;
};

export type RefundTiming = {
  label: string;
  count: number;
  rate: number;
  color: string;
};

export type CancellationStage = {
  label: string;
  count: number;
  rate: number;
  color: string;
};

export type RefundReason = {
  reason: string;
  count: number;
  rate: number;
};

export type CountryRefundRateStatus = "RISK" | "WARNING" | "NORMAL";

export type CountryRefundRate = {
  countryName: string;
  bookingCount: number;
  refundRate: number;
  status: CountryRefundRateStatus;
};

export type RefundManagementData = {
  summary: RefundSummary;
  monthlyTrends: RefundMonthlyTrend[];
  refundTimings: RefundTiming[];
  cancellationStages: CancellationStage[];
  refundReasons: RefundReason[];
  countryRefundRates: CountryRefundRate[];
};
