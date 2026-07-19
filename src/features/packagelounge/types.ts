export interface FlightInfo {
  flightNumber: string;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
}

export interface PackageApiItem {
  packageId: number;
  countryId: number;
  countryName: string;
  accommodationId: number;
  accommodationName: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  flightInfo: FlightInfo | null;
  returnFlightInfo: FlightInfo | null;
  flightPrice: number;
  // 숙소 1박 요금 / 숙소 총액
  pricePerNight: number;
  accommodationPrice: number;
  totalPrice: number;
  depositPrice: number;
  balancePrice: number;
}

export interface AccommodationResponse {
  accommodationId: number;
  countryId: number;
  name: string;
  address: string;
  imageUrl: string;
  pricePerNight: number;
  nights: number;
  description: string;
}

export interface PackageLoungeDetail {
  packageItem: PackageApiItem;
  accommodation: AccommodationResponse;
}

export interface PackageSelection {
  courseId: number;
  countryId: number;
  continentCode: string;
  packageId: number;
  accommodationId: number;
  flightInfo: FlightInfo | null;
  flightPrice: number;
  selectedAt: string;
}

export interface PaymentBreakdown {
  lectureAmount: number;
  flightAmount: number;
  accommodationAmount: number;
  travelAmount: number;
  depositAmount: number;
  balanceAmount: number;
  initialPaymentAmount: number;
}

// 예약 생성(POST /bookings) 요청에 실어 보내는 탑승객 정보
export interface PassengerInfo {
  lastName: string;
  firstName: string;
  birthDate: string;
  passportNumber: string;
  passportExpiry: string;
}

// LOUNGE: 패키지 라운지에서 직접 예약 / COMPLETION: 완강 후 마이페이지에서 예약
export type BookingSource = "LOUNGE" | "COMPLETION";

export interface CreateBookingRequest {
  accommodationId: number;
  flightInfo: FlightInfo | null;
  returnFlightInfo: FlightInfo | null;
  passengerInfo: PassengerInfo;
  flightPrice: number;
  checkInDate: string;
  checkOutDate: string;
  bookingSource: BookingSource;
}

// GET /bookings/{bookingId} 응답 (flightInfo/returnFlightInfo/passengerInfo는
// 서버가 JSON 문자열로 내려줘서 package.service.ts에서 파싱한 뒤 이 타입으로 내려준다)
export interface BookingDetail {
  bookingId: number;
  accommodationId: number;
  userId: number;
  status: string;
  totalPrice: number;
  depositPrice: number;
  balancePrice: number;
  bookingNumber: string;
  flightInfo: FlightInfo | null;
  returnFlightInfo: FlightInfo | null;
  passengerInfo: PassengerInfo | null;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  installmentAllowed: boolean;
  createdAt: string;
}

// FULL: 일시불 / DEPOSIT: 예약금 / LECTURE_ONLY: 강의 단독 결제(패키지 예약과는 무관)
export type PaymentType = "FULL" | "DEPOSIT" | "LECTURE_ONLY";

export interface CreatePaymentRequest {
  bookingId: number;
  paymentType: PaymentType;
  amount: number;
  usedMileage: number;
  usedCouponId: number | null;
  portonePaymentId: string;
}

// POST /payments/bundle 요청 - PortOne 결제 1회로 예약(패키지) + 강의를 함께 결제한다.
// 쿠폰/마일리지는 패키지분에만 적용되고 강의는 항상 정가 전액으로 청구된다 (백엔드가 내부적으로 나눔)
export interface CreateBundlePaymentRequest {
  bookingId: number;
  courseIds: number[];
  paymentType: "DEPOSIT" | "FULL";
  amount: number;
  usedMileage: number;
  usedCouponId: number | null;
  portonePaymentId: string;
}

export interface BundlePaymentResponse {
  bookingPaymentId: number;
  lecturePaymentIds: number[];
  bookingAmount: number;
  lectureAmount: number;
  totalAmount: number;
}

// GET /payments/{paymentId} 응답 - 예약 결제와 강의 단독 결제가 같은 엔드포인트를 공유해서
// bookingId/courseId 둘 다 optional이다 (예약 결제면 courseId가 null, 강의 결제면 bookingId가 null)
export interface PaymentDetail {
  paymentId: number;
  bookingId: number | null;
  courseId: number | null;
  userId: number;
  paymentType: string;
  amount: number;
  usedMileage: number;
  usedCouponId: number | null;
  status: string;
  portonePaymentId: string;
  createdAt: string;
  userName: string | null;
  productName: string | null;
  paymentMethod: string;
}
