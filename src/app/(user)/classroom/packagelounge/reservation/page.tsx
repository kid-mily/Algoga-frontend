import SubHeader from "@/features/common/components/SubHeader";
import Airplane from "@/features/reservation/components/Airplan";
import HotelInfo from "@/features/reservation/components/HotelInfo";
import LectureInfo from "@/features/reservation/components/LectureInfo";
import ReservationPaymentButton from "@/features/reservation/components/PaymentButton";
import PaymentInfo from "@/features/reservation/components/PaymentInfo";
import PeopleInfo from "@/features/reservation/components/PeopleInfo";


export default function Reservation() {
    return (
        <div className="w-full min-h-screen bg-[#f5f6f8] py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* 헤더 */}
                <SubHeader
                backHref={'/classroom/packagelounge'}
                backText="돌아가기"
                title="예약하기"
                description="예약 내용을 최종 확인해주세요"
                />

                {/* 강의 정보 */}
                <LectureInfo/>

                {/* 항공권 정보 */}
                <Airplane/>

                {/* 호텔 정보 */}
                <HotelInfo/>

                {/* 인원 정보 */}
                <PeopleInfo/>

                {/* 결제 금액 */}
                <PaymentInfo/>

                {/* 결제 버튼 */}
                <ReservationPaymentButton/>
            </div>
        </div>
    );
}