// 2차 결제

import SubHeader from "@/features/common/components/SubHeader";
import PackPaymentButton from "@/features/payment/PackPaymentButton";

import SecondCouponForm from "@/features/payment/SecondCouponForm";
import SecondPaymentSummary from "@/features/payment/SecondPaymentSummary";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SecondPayment() {
    
    return (
        <div className="w-full min-h-screen bg-[#f5f6f8] py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <SubHeader
                backHref={'주소가 예약 페이지로 돌아가야함'}
                backText="뒤로가기"
                title="잔금 결제하기"
                description="결제 수단을 선택하고 결제를 진행해주세요"
                />

                {/* 상단 결제 안내 박스 */}
                <div className="rounded-2xl bg-[#439A97] p-6 text-white">
                    <div className="flex items-center gap-1.5 text-xl font-bold">
                        <h3>💰 2차 결제 (잔금) 안내</h3>
                    </div>
                    <p className="mt-2 text-sm font-medium text-white/90">
                        전체 패키지 금액에서 쿠폰 할인을 먼저 적용한 후, 이미 납부하신 예약금을 차감한 금액을 결제합니다.
                    </p>
                    {/* 안내 박스 내부의 서브 경고창 */}
                    <div className="mt-4 rounded-2xl bg-white/15 p-4 text-sm leading-relaxed text-white">
                        <p>전체 패키지: 얼마(백 연동)</p>
                        <p className="mt-1">• • 이미 납부한 예약금: 백</p>
                    </div>
                </div>

                {/* 쿠폰 */}
                <SecondCouponForm/>

                {/* 결제 */}
                <SecondPaymentSummary/>

                <PackPaymentButton/>

            </div>
        </div>
    );
}