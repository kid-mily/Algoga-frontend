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
  accommodationId: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  checkInDate: string;
  checkOutDate: string;
  flightInfo: FlightInfo | null;
  flightPrice: number;
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
