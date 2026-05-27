// 단과 강의 결제 페이지

import SubHeader from "@/features/contentmanage/SubHeader";
import CouponForm from "@/features/payment/CouponForm";
import MileageForm from "@/features/payment/MileageForm";
import PaymentButton from "@/features/payment/PaymentButton";
import PaymentMethod from "@/features/payment/PaymentMethod";
import PaymentSummary from "@/features/payment/PaymentSummary";
import CanclelationPolicy from "../canclelationpolicy/page";

export default function Page() {
    return (
        <div className="w-full min-h-screen bg-[#f5f6f8] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* 상단 타이틀 */}
                <h1 className="text-2xl font-bold">결제하기</h1>
                <p className="text-sm text-[#8A9BB0]">결제 수단을 선택하고 결제를 진행해주세요</p>

                {/* 할인쿠폰 */}
                <CouponForm/>

                {/* 마일리지 */}
                <MileageForm/>
                
                {/* 결제 수단 */}
                <PaymentMethod/>
                
                {/* 결제 금액  */}
                <PaymentSummary/>
                
                {/* 버튼 */}
                <PaymentButton/>
            </div>
        </div>
    );
}