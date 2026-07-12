import type { PackageDetailData } from "./packageDetail.types";

// 패키지 라운지 상세보기 디자인 확인용 더미 데이터 (실제 API 연동 없음)
export const PACKAGE_DETAIL_DATA: PackageDetailData = {
  id: 1,
  title: "도쿄 프리미엄 패키지",
  destination: "도쿄, 일본",
  duration: "4박 5일",
  startDate: "2024.06.15",
  endDate: "2024.06.19",
  maxPeople: "1인",
  airline: "대한항공",
  heroImage: "/images/thumb.png",
  priceRows: [
    { label: "대한항공 KE123 · 왕복", price: 450000 },
    { label: "신주쿠 프린스 호텔 · 4박", price: 320000 },
  ],
  flights: [
    {
      direction: "가는 편",
      flightNumber: "KE123",
      date: "2024.06.15",
      departureTime: "09:00",
      departureAirport: "인천(ICN)",
      arrivalTime: "11:40",
      arrivalAirport: "도쿄 나리타(NRT)",
      duration: "2시간 40분",
      isDirect: true,
    },
    {
      direction: "오는 편",
      flightNumber: "KE124",
      date: "2024.06.19",
      departureTime: "13:00",
      departureAirport: "도쿄 나리타(NRT)",
      arrivalTime: "15:40",
      arrivalAirport: "인천(ICN)",
      duration: "2시간 40분",
      isDirect: true,
    },
  ],
  accommodation: {
    name: "신주쿠 프린스 호텔",
    address: "일본 도쿄도 신주쿠구 가부키초 1-30-1",
    description:
      "신주쿠역과 인접해 있어 관광과 쇼핑이 편리한 호텔입니다. 객실은 모던한 디자인으로 편안한 휴식을 제공합니다.",
    image: "/images/thumb.png",
    checkIn: "2024.06.15",
    checkOut: "2024.06.19",
    nights: "4박",
  },
  notices: [
    {
      title: "예약금 안내",
      items: [
        "여행 총액(항공권 + 숙소)의 30%를 예약금으로 결제합니다.",
        "잔금은 출발 7일 전까지 결제해야 합니다.",
      ],
    },
    {
      title: "취소/환불 정책",
      items: [
        "출발 14일 전 취소 시 예약금 전액 환불됩니다.",
        "출발 7일 이내 취소 시 환불이 제한될 수 있습니다.",
      ],
    },
    {
      title: "여권/비자 안내",
      items: [
        "여권 유효기간이 6개월 이상 남아있어야 합니다.",
        "일본 무비자 입국이 가능하나 최신 정책은 출발 전 확인이 필요합니다.",
      ],
    },
    {
      title: "쿠폰/마일리지",
      items: [
        "보유한 여행 쿠폰은 예약 단계에서 적용할 수 있습니다."
      ],
    },
  ],
  booking: {
    title: "도쿄 프리미엄 패키지",
    dateRange: "2024.06.15 ~ 2024.06.19",
    duration: "4박 5일",
    flightPrice: 450000,
    stayPrice: 320000,
    depositAmount: 231000,
    balanceAmount: 539000,
    totalAmount: 770000,
  },
};
