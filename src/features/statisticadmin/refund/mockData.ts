import type { CountryRefundRate } from "./types";

// by-country API의 예약건수/환불율/평가 필드는 아직 배포 전이라, 배포 전까지 목데이터를 씁니다.
export const countryRefundRatesMockData: CountryRefundRate[] = [
  {
    countryName: "독일",
    bookingCount: 265,
    refundRate: 7.1,
    status: "RISK",
  },
  {
    countryName: "스페인",
    bookingCount: 876,
    refundRate: 6.2,
    status: "RISK",
  },
  {
    countryName: "이탈리아",
    bookingCount: 1024,
    refundRate: 5.8,
    status: "WARNING",
  },
  {
    countryName: "태국",
    bookingCount: 1453,
    refundRate: 5.1,
    status: "WARNING",
  },
  {
    countryName: "프랑스",
    bookingCount: 2108,
    refundRate: 4.2,
    status: "WARNING",
  },
  {
    countryName: "미국",
    bookingCount: 1876,
    refundRate: 4.5,
    status: "WARNING",
  },
];
