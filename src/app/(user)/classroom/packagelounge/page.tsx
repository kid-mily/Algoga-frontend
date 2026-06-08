"use client";

import { useState } from "react";
import SubHeader from "@/features/contentmanage/common/SubHeader"; 
import { useParams } from "next/navigation";
import PackageItem from "@/features/classroom/components/PackageItem";

// Mock Data
const mockPackages = [
    {
        id: 1,
        airlineCode: "KE",
        airlineName: "대한항공",
        departureTime: "09:00",
        departureCode: "ICN",
        arrivalTime: "11:30",
        arrivalCode: "NRT",
        duration: "2h 30m",
        isDirect: true,
        baggage: "23kg × 2",
        remainingSeats: 12,
        hotelName: "신주쿠 프린스 호텔",
        hotelDistance: "신주쿠역 도보 5분",
        price: 350000,
    },
    {
        id: 2,
        airlineCode: "7C",
        airlineName: "제주항공",
        departureTime: "18:00",
        departureCode: "ICN",
        arrivalTime: "20:30",
        arrivalCode: "NRT",
        duration: "2h 30m",
        isDirect: true,
        baggage: "15kg × 1",
        remainingSeats: 5,
        hotelName: "신주쿠 프린스 호텔",
        hotelDistance: "신주쿠역 도보 5분",
        price: 280000,
    },
];

export default function PackagePage() {
    // 검색 필드 상태값 관리
    const [departure, setDeparture] = useState("");
    const [destination, setDestination] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");

    const { continentid, countryid } = useParams();

    const handleSearch = () => {
        console.log("검색 실행:", { departure, destination, departureDate, returnDate });
    };

    const handleBook = (id: number) => {
        console.log(`패키지 ID ${id} 예약 페이지로 이동`);
    };

    return (
        <div className="w-full min-h-screen bg-[#f5f6f8] py-12 px-4">
            <div className="mx-auto max-w-[1200px]">
                
                {/* 공통 서브헤더 사용 */}
                <SubHeader
                    backHref={`/classroom/${continentid}/${countryid}/evaluation/result`}
                    backText="돌아가기"
                    title="패키지 라운지"
                    description="항공·숙소 패키지"
                />

                {/* 상단 검색 바 필터 영역 */}
                <div className="mt-5 rounded-[18px] border border-[#E4E7EC] bg-white p-5">
                    <div className="flex items-center gap-4">
                        
                        {/* 출발지 */}
                        <div className="flex-1 rounded-[12px] border border-[#E4E7EC] px-4 py-2">
                            <label className="block text-[11px] font-semibold text-[#98A2B3]">출발지</label>
                            <input
                                type="text"
                                placeholder="어디서 출발하시나요?"
                                value={departure}
                                onChange={(e) => setDeparture(e.target.value)}
                                className="mt-0.5 w-full bg-transparent text-[14px] font-medium outline-none placeholder:text-[#CBD5E1]"
                            />
                        </div>

                        {/* 도착지 */}
                        <div className="flex-1 rounded-[12px] border border-[#E4E7EC] px-4 py-2">
                            <label className="block text-[11px] font-semibold text-[#98A2B3]">도착지</label>
                            <input
                                type="text"
                                placeholder="어디로 가시나요?"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="mt-0.5 w-full bg-transparent text-[14px] font-medium outline-none placeholder:text-[#CBD5E1]"
                            />
                        </div>

                        {/* 출발일 */}
                        <div className="flex-1 rounded-[12px] border border-[#E4E7EC] px-4 py-2">
                            <label className="block text-[11px] font-semibold text-[#98A2B3]">출발일</label>
                            <input
                                type="date"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                className="mt-0.5 w-full bg-transparent text-[14px] font-medium outline-none text-[#111827]"
                            />
                        </div>

                        {/* 귀국일 */}
                        <div className="flex-1 rounded-[12px] border border-[#E4E7EC] px-4 py-2">
                            <label className="block text-[11px] font-semibold text-[#98A2B3]">귀국일</label>
                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                className="mt-0.5 w-full bg-transparent text-[14px] font-medium outline-none text-[#111827]"
                            />
                        </div>

                        {/* 검색하기 버튼 */}
                        <button
                            onClick={handleSearch}
                            className="flex h-[52px] items-center gap-2 rounded-[14px] bg-[#5F8D8A] px-6 text-[15px] font-semibold text-white transition hover:bg-[#4C7370]"
                        >
                            <span>🔍</span> 검색하기
                        </button>
                    </div>
                </div>

                {/* 패키지 아이템 리스트 영역 */}
                <div className="mt-6 flex flex-col gap-4">
                    {mockPackages.map((pkg) => (
                        <PackageItem
                            key={pkg.id}
                            airlineCode={pkg.airlineCode}
                            airlineName={pkg.airlineName}
                            departureTime={pkg.departureTime}
                            departureCode={pkg.departureCode}
                            arrivalTime={pkg.arrivalTime}
                            arrivalCode={pkg.arrivalCode}
                            duration={pkg.duration}
                            isDirect={pkg.isDirect}
                            baggage={pkg.baggage}
                            remainingSeats={pkg.remainingSeats}
                            hotelName={pkg.hotelName}
                            hotelDistance={pkg.hotelDistance}
                            price={pkg.price}
                            onBook={() => handleBook(pkg.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}