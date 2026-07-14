export type BalanceQuery = {
  from: string;
  to: string;
};

export type BalancePeriod = "today" | "thisWeek" | "thisMonth" | "thisYear";

export type BalanceSummary = {
  conversionRate: number;
  outstandingAmount: number;
  depositPaidCount: number;
  fullPaidCount: number;
  atRiskCount: number;
  dueSoonCount: number;
};

export type RecoveryRatePoint = {
  day: number;
  rate: number;
};

export type CountryBalanceConversion = {
  countryName: string;
  conversionRate: number;
  depositPaidCount: number;
  fullPaidCount: number;
};

export type OutstandingReservation = {
  bookingNumber: string;
  customerName: string;
  productName: string;
  outstandingAmount: number;
  contractDate: string;
  elapsedDays: number;
  checkInDate: string;
  dDay: number;
};

export type BalanceManagementData = {
  summary: BalanceSummary;
  recoveryRates: RecoveryRatePoint[];
  countryConversions: CountryBalanceConversion[];
  outstandingReservations: OutstandingReservation[];
};
