// 일시불

// 1차 결제

import SubHeader from "@/features/common/components/SubHeader";
import FirstPackCouponForm from "@/features/payment/FirstCouponForm";
import FirstPaymentSummary from "@/features/payment/FirstPaymentSummary";
import PackMileageForm from "@/features/payment/PackMileageForm";
import PackPaymentButton from "@/features/payment/PackPaymentButton";
import PassportForm from "@/features/payment/PassportForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function FullPayment() {
    
    return (
        <div className="w-full min-h-screen bg-[#f5f6f8] py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <SubHeader
                backHref={'주소가 예약 페이지로 돌아가야함'}
                backText="예약 확인으로 돌아가기"
                title="일시불 결제하기"
                description="결제 수단을 선택하고 결제를 진행해주세요"
                />

                {/* 상단 결제 안내 박스 */}
                <div className="rounded-2xl bg-[#F57C00] p-6 text-white">
                    <div className="flex items-center gap-1.5 text-xl font-bold">
                        <h3>💳 일시불 결제 안내</h3>
                    </div>
                    <p className="mt-2 text-sm font-medium text-white/90">
                        전체 패키지 금액을 한 번에 결제합니다.
                    </p>
                    {/* 안내 박스 내부의 서브 경고창 */}
                    <div className="mt-4 rounded-2xl bg-white/15 p-4 text-sm leading-relaxed text-white">
                        <p>✓ 쿠폰·마일리지를 전체 금액에 적용할 수 있습니다</p>
                    </div>
                </div>

                {/* 여권 정보 입력 */}
                <PassportForm/>

                {/* 쿠폰 */}
                <FirstPackCouponForm/>

                {/* 마일리지 */}
                <PackMileageForm/>

                {/* 결제 */}
                <FirstPaymentSummary/>

                <PackPaymentButton/>

            </div>
        </div>
    );
}