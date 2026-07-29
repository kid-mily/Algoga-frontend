// 패키지 라운지 상세보기 페이지에서 사용하는 타입 모음

export interface FlightSegment {
  direction: string; // "가는 편" | "오는 편"
  flightNumber: string;
  date: string;
  departureTime: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalAirport: string;
  duration: string;
  isDirect: boolean;
}

export interface PackagePriceRow {
  label: string;
  price: number;
}

export interface PackageAccommodation {
  name: string;
  address: string;
  // 2026-07-24 백엔드 accommodationDescription 배포 완료 — 값 없으면(null) 빈 문자열로 내려옴
  description: string;
  image: string;
  checkIn: string;
  checkOut: string;
  nights: string;
}

export interface PackageNotice {
  title: string;
  items: string[];
}

export interface PackageBookingInfo {
  title: string;
  dateRange: string;
  duration: string;
  flightPrice: number;
  stayPrice: number;
  depositAmount: number;
  balanceAmount: number;
  totalAmount: number;
  // 항공편 정보를 불러오지 못하면(null) 예약을 진행할 수 없다
  canBook: boolean;
}

export interface PackageDetailData {
  id: number;
  title: string;
  destination: string;
  duration: string;
  startDate: string;
  endDate: string;
  maxPeople: string;
  airline: string;
  heroImage: string;
  // 패키지(여행 상품) 자체 설명 — 값 없으면(null) 빈 문자열로 내려옴. 숙소 설명(accommodation.description)과는 다른 필드
  description: string;
  priceRows: PackagePriceRow[];
  flights: FlightSegment[];
  accommodation: PackageAccommodation;
  notices: PackageNotice[];
  booking: PackageBookingInfo;
}
