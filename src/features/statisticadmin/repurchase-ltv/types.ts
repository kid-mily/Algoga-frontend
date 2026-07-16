export type RepurchaseLtvSummary = {
  repurchaseRate: number;
  arpu: number;
  averagePurchaseIntervalDays: number;
  topCustomerRevenueShare: number;
};

// 백엔드가 히트맵(retentionRate)과 누적매출(cumulativeRevenue)을 코호트 한 행에 같이 내려줍니다.
// 배열은 M0(가입월)부터 M(maxMonths-1)까지이며, 아직 도래하지 않은 시점은 null입니다.
export type CohortRow = {
  cohortMonth: string;
  cohortSize: number;
  retentionRate: Array<number | null>;
  cumulativeRevenue: Array<number | null>;
};

export type TopCustomer = {
  rank: number;
  name: string;
  bookingCount: number;
  cumulativePayment: number;
  recentDestination: string;
  averagePurchaseIntervalDays: number;
};

export type RepurchaseLtvStatistics = {
  summary: RepurchaseLtvSummary;
  maxMonths: number;
  cohorts: CohortRow[];
  topCustomers: TopCustomer[];
};
