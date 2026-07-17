export type CountryProfitabilitySummary = {
    countryCount: number;  // 집계국가 수
    totalNetRevenue: number;  // 총 순매출
    averageRefundRate: number;  // 평균 환불율
};

export type CountryProfitabilityItem = {
    countryName: string;              // 국가명
    bookingCount: number;             // 예약수
    grossRevenue: number;             // 총매출
    netRevenue: number;               // 순매출
    refundRate: number;               // 환불율
    balanceConversionRate: number;    // 잔금전환율
    cancelRate: number;               // 취소율
    share: number;                    // 순매출 점유율
};
