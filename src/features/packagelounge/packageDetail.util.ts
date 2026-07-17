// 실제 패키지 상세 API 응답(PackageLoungeDetail)을 상세 페이지 UI 타입(PackageDetailData)으로 변환한다
import { PACKAGE_NOTICES } from "./packageDetail.data";
import type { FlightSegment, PackageDetailData } from "./packageDetail.types";
import type { FlightInfo, PackageLoungeDetail } from "./types";

// "2h 30m" 형태의 API 응답을 "2시간 30분"으로 표시한다
function formatFlightDuration(duration: string) {
  return duration.replace(/(\d+)h/, "$1시간 ").replace(/(\d+)m/, "$1분").trim();
}

function toFlightSegment(direction: string, info: FlightInfo): FlightSegment {
  return {
    direction,
    flightNumber: info.flightNumber,
    date: info.departureTime.slice(0, 10).replaceAll("-", "."),
    departureTime: info.departureTime.slice(11, 16),
    departureAirport: info.departure,
    arrivalTime: info.arrivalTime.slice(11, 16),
    arrivalAirport: info.arrival,
    duration: formatFlightDuration(info.duration),
    isDirect: true,
  };
}

export function toPackageDetailData(
  detail: PackageLoungeDetail
): PackageDetailData {
  const { packageItem, accommodation } = detail;
  const duration = `${packageItem.nights}박 ${packageItem.nights + 1}일`;

  const flights: FlightSegment[] = [];
  if (packageItem.flightInfo) {
    flights.push(toFlightSegment("가는 편", packageItem.flightInfo));
  }
  if (packageItem.returnFlightInfo) {
    flights.push(toFlightSegment("오는 편", packageItem.returnFlightInfo));
  }

  return {
    id: packageItem.packageId,
    title: packageItem.name,
    destination: packageItem.countryName,
    duration,
    startDate: packageItem.checkInDate,
    endDate: packageItem.checkOutDate,
    maxPeople: "1인",
    airline: packageItem.flightInfo?.airline ?? "",
    heroImage: packageItem.imageUrl,
    priceRows: [
      {
        label: packageItem.flightInfo
          ? `${packageItem.flightInfo.airline} ${packageItem.flightInfo.flightNumber} · 왕복`
          : "항공권",
        price: packageItem.flightPrice,
      },
      {
        label: `${packageItem.accommodationName} · ${packageItem.nights}박`,
        price: packageItem.accommodationPrice,
      },
    ],
    flights,
    accommodation: {
      name: packageItem.accommodationName,
      address: accommodation.address,
      description: accommodation.description,
      image: accommodation.imageUrl,
      checkIn: packageItem.checkInDate,
      checkOut: packageItem.checkOutDate,
      nights: `${packageItem.nights}박`,
    },
    notices: PACKAGE_NOTICES,
    booking: {
      title: packageItem.name,
      dateRange: `${packageItem.checkInDate} ~ ${packageItem.checkOutDate}`,
      duration,
      flightPrice: packageItem.flightPrice,
      stayPrice: packageItem.accommodationPrice,
      depositAmount: packageItem.depositPrice,
      balanceAmount: packageItem.balancePrice,
      totalAmount: packageItem.totalPrice,
      // 항공편 조회 실패(null) 시 예약 자체를 막는다
      canBook: Boolean(packageItem.flightInfo && packageItem.returnFlightInfo),
    },
  };
}
