// 패키지 예약 페이지 상단 안내 영역
// 결제 페이지(PackagePaymentClient)와 동일한 헤더 스타일을 사용합니다.
export default function BookingHeader() {
  return (
    <div>
      <span className="text-xs font-bold tracking-[0.16em] text-[#439A97]">
        PACKAGE BOOKING
      </span>

      <h1 className="mt-2 text-2xl font-extrabold text-[#0A1628] sm:text-3xl">
        패키지 예약
      </h1>

      <p className="mt-2 text-sm text-[#718096]">
        선택한 여행 정보와 강의 정보를 확인하고 예약에 필요한 정보를 입력해 주세요.
      </p>
    </div>
  );
}
