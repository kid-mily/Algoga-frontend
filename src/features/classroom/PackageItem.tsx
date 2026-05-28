"use client";

interface PackageItemProps {
    airlineCode: string;
    airlineName: string;
    departureTime: string;
    departureCode: string;
    arrivalTime: string;
    arrivalCode: string;
    duration: string;
    isDirect: boolean;
    baggage: string;
    remainingSeats: number;
    hotelName: string;
    hotelDistance: string;
    price: number;
    onBook: () => void;
}

export default function PackageItem({
    airlineCode,
    airlineName,
    departureTime,
    departureCode,
    arrivalTime,
    arrivalCode,
    duration,
    isDirect,
    baggage,
    remainingSeats,
    hotelName,
    hotelDistance,
    price,
    onBook,
    }: PackageItemProps) {
    return (
        <div className="flex items-center justify-between rounded-[20px] border border-[#E4E7EC] bg-white p-6 transition hover:shadow-sm">
            {/* 왼쪽 영역 */}
            <div className="flex flex-1 items-center gap-8">
                
                {/* 항공사 */}
                <div className="flex w-[75px] flex-col items-center justify-center">
                <div
                    className={
                    airlineCode === "KE"
                        ? "flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#538B86] text-[15px] font-bold text-white"
                        : "flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#5C7F80] text-[15px] font-bold text-white"
                    }
                >
                    {airlineCode}
                </div>
                <span className="mt-2 text-center text-[12px] font-semibold text-[#667085]">
                    {airlineName}
                </span>
                </div>

                {/* 시간 (출발 - 비행 - 도착) */}
                <div className="flex items-center gap-5">
                {/* 출발 */}
                <div className="text-center">
                    <div className="text-[24px] font-bold text-[#111827]">{departureTime}</div>
                    <div className="text-[12px] font-medium text-[#98A2B3]">{departureCode}</div>
                </div>

                {/* 비행 */}
                <div className="flex w-[90px] flex-col items-center">
                    <span className="mb-0.5 text-[11px] text-[#98A2B3]">{duration}</span>
                    <div className="relative flex h-[1px] w-full items-center justify-center bg-[#E4E7EC]">
                    <span className="absolute bg-white px-1 text-[11px] text-[#98A2B3]">✈️</span>
                    </div>
                    {isDirect && (
                    <span className="mt-1 rounded bg-[#E4F2F1] px-1.5 py-0.5 text-[11px] font-bold text-[#538B86]">
                        직항
                    </span>
                    )}
                </div>

                {/* 도착 */}
                <div className="text-center">
                    <div className="text-[24px] font-bold text-[#111827]">{arrivalTime}</div>
                    <div className="text-[12px] font-medium text-[#98A2B3]">{arrivalCode}</div>
                </div>
                </div>

                {/* 수하물 및 잔여석 */}
                <div className="ml-2 flex min-w-[100px] flex-col gap-1 text-[13px] text-[#667085]">
                <div className="flex items-center gap-1">
                    <span className="text-[#98A2B3]">💼</span>
                    {baggage}
                </div>
                <div className="font-semibold text-[#D92D20]">잔여 {remainingSeats}석</div>
                </div>

                {/* 세로 구분선 */}
                <div className="mx-2 h-[44px] w-[1px] bg-[#E4E7EC]" />

                {/* 호텔 정보 */}
                <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[17px] font-bold text-[#111827]">
                    <span>🏢</span>
                    {hotelName}
                </div>
                <div className="flex items-center gap-1 text-[13px] text-[#667085]">
                    <span>📍</span>
                    {hotelDistance}
                </div>
                </div>
            </div>

            {/* 오른쪽 영역 (가격 및 예약하기 버튼) */}
            <div className="flex items-center gap-6">
                {/* 가격 */}
                <div className="text-right">
                <div className="text-[24px] font-bold text-[#538B86]">
                    {price.toLocaleString()}원
                </div>
                <div className="text-[12px] font-medium text-[#98A2B3]">1인 기준</div>
                </div>

                {/* 예약 버튼 */}
                <button
                onClick={onBook}
                className="flex h-[44px] min-w-[120px] items-center justify-center gap-1 rounded-[14px] bg-[#538B86] px-5 text-[14px] font-semibold text-white transition hover:bg-[#43706C]"
                >
                예약하기
                <span className="text-[15px] leading-none text-white/90">→</span>
                </button>
            </div>
        </div>
    );
}