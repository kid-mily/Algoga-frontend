'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SubHeader from '@/features/contentmanage/common/SubHeader';
import CourseInfoCard from '@/features/payment/CourseInfoCard';
import CouponSelector from '@/features/payment/CouponSelector';
import MileageInput from '@/features/payment/MileageInput';
import PaymentSummary from '@/features/payment/PaymentSummary';
import { requestTossPayment } from '@/features/services/portone.service';
import { MyCoupon } from '@/features/payment/types';
import { CourseItem } from '@/features/classroom/components/types';
import { getCourseDetail } from '@/features/services/lectureDetail.service';
import { getUsableCouponsByCourse, getMyMileage } from '@/features/services/myBenefit.service';
import { createLecturePayment } from '@/features/services/SinglePayment.service';
import { PaymentButtons } from '@/features/payment/PaymentButton';

const getParam = (value: string | string[] | undefined) => {
    if (!value) return '';
    return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

const getCouponDiscount = (coupon: MyCoupon | null, price: number) => {
    if (!coupon) return 0;
    if (coupon.discountType === 'RATE') {
        return Math.floor((price * coupon.discountValue) / 100);
    }
    return Math.min(coupon.discountValue, price);
};

export default function SingleLecturePaymentPage() {
    const params = useParams();
    const router = useRouter();

    const continentCode = getParam(params.continentCode);
    const countryId = getParam(params.countryId || params.countryid);
    const courseId = Number(getParam(params.courseId));

    const [course, setCourse] = useState<CourseItem | null>(null);
    const [coupons, setCoupons] = useState<MyCoupon[]>([]);
    const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
    const [mileageBalance, setMileageBalance] = useState(0);
    const [usedMileage, setUsedMileage] = useState(0);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // 브라우저(클라이언트) 환경에서 직접 API들을 순차적으로 로드
    useEffect(() => {
        if (!countryId || !courseId) return;

        const initPaymentPage = async () => {
            try {
                setIsLoading(true);
                setErrorMessage('');

                const courseData = await getCourseDetail(countryId, courseId);
                setCourse(courseData);

                const couponData = await getUsableCouponsByCourse(courseId).catch(() => [] as MyCoupon[]);
                setCoupons(couponData);

                const mileageData = await getMyMileage().catch(() => ({ totalMileage: 0 }));
                setMileageBalance(mileageData?.totalMileage ?? 0);

            } catch (error: any) {
                setErrorMessage(error?.response?.data?.message || error?.message || '결제 정보를 불러오지 못했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        initPaymentPage();
    }, [countryId, courseId]);

    const selectedCoupon = useMemo(() => {
        return coupons.find((coupon) => coupon.userCouponId === selectedCouponId) ?? null;
    }, [coupons, selectedCouponId]);

    const price = Number(course?.price ?? 0);
    const couponDiscount = getCouponDiscount(selectedCoupon, price);
    const maxMileage = Math.min(mileageBalance, Math.max(price - couponDiscount, 0));
    const finalAmount = Math.max(price - couponDiscount - usedMileage, 0);

    const handleMileageChange = (value: string) => {
        const nextValue = Math.max(0, Number(value || 0));
        setUsedMileage(Math.min(nextValue, maxMileage));
    };

    // 브라우저가 직접 백엔드 서비스 API(createLecturePayment)를 호출
    const handlePay = async () => {
        if (!course || isPaying) return;

        try {
            setIsPaying(true);
            setErrorMessage('');

            let portonePaymentId = "";

            // 실 결제 금액이 있을 때만 포트원 창 띄우기
            if (finalAmount > 0) {
                const paymentResult = await requestTossPayment({
                    orderName: course.title,
                    totalAmount: finalAmount,
                });
                
                // 사용자가 창을 닫거나 취소한 경우 catch 블록으로 던짐
                if (!paymentResult) {
                    throw new Error('PAY_PROCESS_CANCELED');
                }

                // 포트원 응답 타입이 객체형이든 문자열형이든 안전하게 진짜 ID 문자열만 필터링
                if (typeof paymentResult === 'object' && paymentResult !== null) {
                    portonePaymentId = paymentResult.paymentId || paymentResult.portonePaymentId || "";
                } else if (typeof paymentResult === 'string') {
                    portonePaymentId = paymentResult;
                }

                if (!portonePaymentId) {
                    throw new Error('결제 ID를 받아오지 못했습니다.');
                }
            }

            // 백에 맞춰 가공
            const paymentPayload = {
                courseId: Number(courseId),
                amount: finalAmount,
                usedMileage: Number(usedMileage),
                usedCouponId: selectedCouponId ? Number(selectedCouponId) : null,
                portonePaymentId: portonePaymentId || "", // 0원 결제 시 빈 값 처리
            };

            // 브라우저에서 백엔드 호출
            await createLecturePayment(paymentPayload);

            // 성공 시 리다이렉트
            router.push(`/classroom/${continentCode}/${countryId}/lecture/${courseId}/payment/single/complete`);
        } catch (error: any) {
            console.error("❌ 결제 처리 실패:", error);

            // 사용자가 의도적으로 취소한 경우 차단 (백엔드로 안 넘어가게 브레이크)
            const errorStr = String(error?.message || error);
            if (errorStr.includes('CANCELED') || errorStr.includes('취소')) {
                alert('결제가 취소되었습니다.');
                return;
            }
            
            // 그 외 백엔드가 터진 500 에러 등의 진짜 메시지 파싱
            const serverErrorMessage = error?.response?.data?.message || error?.message || '결제 처리에 실패했습니다.';
            setErrorMessage(serverErrorMessage);
        } finally {
            setIsPaying(false);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center text-sm text-gray-500">결제 정보를 불러오는 중입니다...</div>;
    if (!course) return <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center text-red-500 font-semibold">{errorMessage || '강의 데이터가 존재하지 않습니다.'}</div>;

    return (
        <div className="min-h-screen bg-[#f5f6f8] px-4 py-12">
            <div className="mx-auto max-w-4xl space-y-5">
                <SubHeader
                    backHref={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
                    backText="강의로 돌아가기"
                    title="결제하기"
                    description="쿠폰 and 마일리지를 적용한 뒤 결제를 진행해주세요."
                />

                {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3 items-start text-sm text-red-600">
                        <div>
                            <h4 className="font-bold text-red-800 mb-0.5">⚠️ 결제에 실패했습니다</h4>
                            <p className="text-gray-600 mb-2">{errorMessage}</p>
                            <p className="text-xs text-red-500 font-medium">
                                * 입력하신 마일리지/쿠폰을 확인하시거나 잠시 후 다시 시도해 주세요.
                            </p>
                        </div>
                    </div>
                )}
                
                <CourseInfoCard title={course.title} description={course.description} price={price} />

                <CouponSelector
                    coupons={coupons}
                    selectedCouponId={selectedCouponId}
                    onChange={(couponId) => {
                        setSelectedCouponId(couponId);
                        setUsedMileage(0);
                    }}
                />

                <MileageInput mileageBalance={mileageBalance} maxMileage={maxMileage} usedMileage={usedMileage} onChange={handleMileageChange} />
                <PaymentSummary price={price} couponDiscount={couponDiscount} usedMileage={usedMileage} finalAmount={finalAmount} />
                <PaymentButtons finalAmount={finalAmount} isPaying={isPaying} onBack={() => router.back()} onPay={handlePay} />
            </div>
        </div>
    );
}