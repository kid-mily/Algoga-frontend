// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import SubHeader from '@/features/contentmanage/common/SubHeader';
// import CourseInfoCard from '@/features/payment/CourseInfoCard';
// import CouponSelector from '@/features/payment/CouponSelector';
// import MileageInput from '@/features/payment/MileageInput';
// import PaymentSummary from '@/features/payment/PaymentSummary';
// import { requestTossPayment } from '@/features/services/portone.service';
// import { MyCoupon } from '@/features/payment/types';
// import { CourseItem } from '@/features/classroom/components/types';
// import { getCourseDetail } from '@/features/services/lectureDetail.service';
// import { getUsableCouponsByCourse, getMyMileage } from '@/features/services/myBenefit.service';
// import { createLecturePayment } from '@/features/services/SinglePayment.service';
// import { PaymentButtons } from '@/features/payment/PaymentButton';

// const getParam = (value: string | string[] | undefined) => {
//     if (!value) return '';
//     return decodeURIComponent(Array.isArray(value) ? value[0] : value);
// };

// const getCouponDiscount = (coupon: MyCoupon | null, price: number) => {
//     if (!coupon) return 0;
//     if (coupon.discountType === 'RATE') {
//         return Math.floor((price * coupon.discountValue) / 100);
//     }
//     return Math.min(coupon.discountValue, price);
// };

// export default function SingleLecturePaymentPage() {
//     const params = useParams();
//     const router = useRouter();

//     const continentCode = getParam(params.continentCode);
//     const countryId = getParam(params.countryId || params.countryid);
//     const courseId = Number(getParam(params.courseId));

//     const [course, setCourse] = useState<CourseItem | null>(null);
//     const [coupons, setCoupons] = useState<MyCoupon[]>([]);
//     const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
//     const [mileageBalance, setMileageBalance] = useState(0);
//     const [usedMileage, setUsedMileage] = useState(0);
    
//     const [isLoading, setIsLoading] = useState(true);
//     const [isPaying, setIsPaying] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');

//     // 브라우저(클라이언트) 환경에서 직접 API들을 순차적으로 로드
//     useEffect(() => {
//         if (!countryId || !courseId) return;

//         const initPaymentPage = async () => {
//             try {
//                 setIsLoading(true);
//                 setErrorMessage('');

//                 const courseData = await getCourseDetail(countryId, courseId);
//                 setCourse(courseData);

//                 const couponData = await getUsableCouponsByCourse(courseId).catch(() => [] as MyCoupon[]);
//                 setCoupons(couponData);

//                 const mileageData = await getMyMileage().catch(() => ({ totalMileage: 0 }));
//                 setMileageBalance(mileageData?.totalMileage ?? 0);

//             } catch (error: any) {
//                 setErrorMessage(error?.response?.data?.message || error?.message || '결제 정보를 불러오지 못했습니다.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         initPaymentPage();
//     }, [countryId, courseId]);

//     const selectedCoupon = useMemo(() => {
//         return coupons.find((coupon) => coupon.userCouponId === selectedCouponId) ?? null;
//     }, [coupons, selectedCouponId]);

//     const price = Number(course?.price ?? 0);
//     const couponDiscount = getCouponDiscount(selectedCoupon, price);
//     const maxMileage = Math.min(mileageBalance, Math.max(price - couponDiscount, 0));
//     const finalAmount = Math.max(price - couponDiscount - usedMileage, 0);

//     const handleMileageChange = (value: string) => {
//         const nextValue = Math.max(0, Number(value || 0));
//         setUsedMileage(Math.min(nextValue, maxMileage));
//     };

//     // 브라우저가 직접 백엔드 서비스 API(createLecturePayment)를 호출
//     const handlePay = async () => {
//   // 강의 정보가 없거나 이미 결제 처리 중이면 중복 실행 방지
//   if (!course || isPaying) return;

//   try {
//     setIsPaying(true);
//     setErrorMessage("");

//     let portonePaymentId: string | null = null;

//     // 실제 결제 금액이 있는 경우에만 포트원 결제창 실행
//     if (finalAmount > 0) {
//       const paymentResult = await requestTossPayment({
//         orderName: course.title,
//         totalAmount: finalAmount,
//       });

//       // 결제창을 닫거나 결제를 취소한 경우
//       if (!paymentResult) {
//         throw new Error("PAY_PROCESS_CANCELED");
//       }

//       // 포트원 응답에서 결제 ID 추출
//       if (typeof paymentResult === "string") {
//         portonePaymentId = paymentResult;
//       } else if (
//         typeof paymentResult === "object" &&
//         paymentResult !== null
//       ) {
//         portonePaymentId =
//           paymentResult.paymentId ??
//           paymentResult.portonePaymentId ??
//           null;
//       }

//       if (!portonePaymentId) {
//         throw new Error("결제 ID를 받아오지 못했습니다.");
//       }
//     }

//     // 백엔드 결제 생성 API에 전달할 데이터
//     const paymentPayload = {
//       courseId: Number(courseId),
//       amount: Number(finalAmount),
//       usedMileage: Number(usedMileage),
//       usedCouponId: selectedCouponId,
//       portonePaymentId,
//     };

//     console.log("강의 결제 요청 데이터:", paymentPayload);

//     // 백엔드 결제 생성 요청
//     await createLecturePayment(paymentPayload);

//     // 결제 완료 페이지로 이동
//     router.push(
//       `/classroom/${continentCode}/${countryId}/lecture/${courseId}/payment/single/complete`
//     );
//   } catch (error) {
//     console.error("❌ 결제 처리 실패:", error);

//     const errorMessage =
//       error instanceof Error
//         ? error.message
//         : "결제 처리에 실패했습니다.";

//     // 사용자가 결제창에서 취소한 경우
//     if (
//       errorMessage.includes("CANCELED") ||
//       errorMessage.includes("취소")
//     ) {
//       setErrorMessage("결제가 취소되었습니다.");
//       return;
//     }

//     // 서버 오류 등의 메시지를 화면에 표시
//     setErrorMessage(errorMessage);
//   } finally {
//     setIsPaying(false);
//   }
// };

//     if (isLoading) return <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center text-sm text-gray-500">결제 정보를 불러오는 중입니다...</div>;
//     if (!course) return <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center text-red-500 font-semibold">{errorMessage || '강의 데이터가 존재하지 않습니다.'}</div>;

//     return (
//         <div className="min-h-screen bg-[#f5f6f8] px-4 py-12">
//             <div className="mx-auto max-w-4xl space-y-5">
//                 <SubHeader
//                     backHref={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
//                     backText="강의로 돌아가기"
//                     title="결제하기"
//                     description="쿠폰과 마일리지를 적용한 뒤 결제를 진행해주세요."
//                 />

//                 {errorMessage && (
//                     <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3 items-start text-sm text-red-600">
//                         <div>
//                             <h4 className="font-bold text-red-800 mb-0.5">⚠️ 결제에 실패했습니다</h4>
//                             <p className="text-gray-600 mb-2">{errorMessage}</p>
//                             <p className="text-xs text-red-500 font-medium">
//                                 * 입력하신 마일리지/쿠폰을 확인하시거나 잠시 후 다시 시도해 주세요.
//                             </p>
//                         </div>
//                     </div>
//                 )}
                
//                 <CourseInfoCard title={course.title} description={course.description} price={price} />

//                 <CouponSelector
//                     coupons={coupons}
//                     selectedCouponId={selectedCouponId}
//                     onChange={(couponId) => {
//                         setSelectedCouponId(couponId);
//                         setUsedMileage(0);
//                     }}
//                 />

//                 <MileageInput mileageBalance={mileageBalance} maxMileage={maxMileage} usedMileage={usedMileage} onChange={handleMileageChange} />
//                 <PaymentSummary price={price} couponDiscount={couponDiscount} usedMileage={usedMileage} finalAmount={finalAmount} />
//                 <PaymentButtons finalAmount={finalAmount} isPaying={isPaying} onBack={() => router.back()} onPay={handlePay} />
//             </div>
//         </div>
//     );
// }



"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import CourseInfoCard from "@/features/payment/CourseInfoCard";
import CouponSelector from "@/features/payment/CouponSelector";
import MileageInput from "@/features/payment/MileageInput";
import PaymentSummary from "@/features/payment/PaymentSummary";
import { PaymentButtons } from "@/features/payment/PaymentButton";
import { requestTossPayment } from "@/features/services/portone.service";
import { MyCoupon } from "@/features/payment/types";
import { CourseItem } from "@/features/classroom/components/types";
import { getCourseDetail } from "@/features/services/lectureDetail.service";
import {
  getMyMileage,
  getUsableCouponsByCourse,
} from "@/features/services/myBenefit.service";
import {
  createLecturePayment,
  LecturePaymentError,
} from "@/features/services/SinglePayment.service";

// 동적 라우트 값을 문자열로 변환
const getParam = (
  value: string | string[] | undefined
) => {
  if (!value) {
    return "";
  }

  return decodeURIComponent(
    Array.isArray(value) ? value[0] : value
  );
};

// 선택한 쿠폰의 할인 금액 계산
const getCouponDiscount = (
  coupon: MyCoupon | null,
  price: number
) => {
  if (!coupon) {
    return 0;
  }

  // 정률 할인
  if (coupon.discountType === "RATE") {
    return Math.floor(
      (price * coupon.discountValue) / 100
    );
  }

  // 정액 할인
  return Math.min(coupon.discountValue, price);
};

export default function SingleLecturePaymentPage() {
  const params = useParams();
  const router = useRouter();

  const continentCode = getParam(params.continentCode);

  const countryId = getParam(
    params.countryId || params.countryid
  );

  const courseId = Number(getParam(params.courseId));

  const [course, setCourse] =
    useState<CourseItem | null>(null);

  const [coupons, setCoupons] = useState<MyCoupon[]>([]);

  const [selectedCouponId, setSelectedCouponId] =
    useState<number | null>(null);

  const [mileageBalance, setMileageBalance] =
    useState(0);

  const [usedMileage, setUsedMileage] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isPaying, setIsPaying] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  // 결제 페이지에 필요한 데이터 조회
  useEffect(() => {
    if (!countryId || !courseId) {
      setIsLoading(false);
      setErrorMessage("잘못된 강의 정보입니다.");
      return;
    }

    const initPaymentPage = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        // 강의 상세 조회
        const courseData = await getCourseDetail(
          countryId,
          courseId
        );

        setCourse(courseData);

        // 사용 가능한 쿠폰 조회
        // 실패해도 결제 페이지는 유지
        const couponData =
          await getUsableCouponsByCourse(courseId).catch(
            () => [] as MyCoupon[]
          );

        setCoupons(couponData);

        // 보유 마일리지 조회
        // 실패하면 0으로 처리
        const mileageData = await getMyMileage().catch(
          () => ({
            totalMileage: 0,
          })
        );

        setMileageBalance(
          mileageData?.totalMileage ?? 0
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "결제 정보를 불러오지 못했습니다.";

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    initPaymentPage();
  }, [countryId, courseId]);

  // 선택된 쿠폰 찾기
  const selectedCoupon = useMemo(() => {
    return (
      coupons.find(
        (coupon) =>
          coupon.userCouponId === selectedCouponId
      ) ?? null
    );
  }, [coupons, selectedCouponId]);

  const price = Number(course?.price ?? 0);

  const couponDiscount = getCouponDiscount(
    selectedCoupon,
    price
  );

  // 사용할 수 있는 최대 마일리지
  const maxMileage = Math.min(
    mileageBalance,
    Math.max(price - couponDiscount, 0)
  );

  // 최종 결제 금액
  const finalAmount = Math.max(
    price - couponDiscount - usedMileage,
    0
  );

  // 마일리지 입력 처리
  const handleMileageChange = (value: string) => {
    const numericValue = Number(value || 0);

    const nextValue = Number.isFinite(numericValue)
      ? Math.max(0, numericValue)
      : 0;

    setUsedMileage(
      Math.min(nextValue, maxMileage)
    );
  };

  // 결제 처리
  const handlePay = async () => {
    if (!course || isPaying) {
      return;
    }

    try {
      setIsPaying(true);
      setErrorMessage("");

      let portonePaymentId: string | null = null;

      // 실제 결제 금액이 있는 경우 포트원 결제창 실행
      if (finalAmount > 0) {
        const paymentResult =
          await requestTossPayment({
            orderName: course.title,
            totalAmount: finalAmount,
          });

        console.log(
          "포트원 전체 결제 결과:",
          paymentResult
        );

        // 사용자가 결제창을 닫거나 취소한 경우
        if (!paymentResult) {
          throw new Error("PAY_PROCESS_CANCELED");
        }

        // 포트원 결제 ID 추출
        if (typeof paymentResult === "string") {
          portonePaymentId = paymentResult;
        } else if (
          typeof paymentResult === "object" &&
          paymentResult !== null
        ) {
          portonePaymentId =
            paymentResult.paymentId ??
            paymentResult.portonePaymentId ??
            null;
        }

        if (!portonePaymentId) {
          throw new Error(
            "결제 ID를 받아오지 못했습니다."
          );
        }
      }

      // 백엔드 결제 API 요청 데이터
      const paymentPayload = {
        courseId,
        amount: finalAmount,
        usedMileage,
        usedCouponId: selectedCouponId,
        portonePaymentId,
      };

      console.log(
        "강의 결제 요청 데이터:",
        paymentPayload
      );

      /*
       * createLecturePayment 내부에서
       * credentials: "include"를 사용하므로
       * 브라우저의 로그인 쿠키가 자동으로 전송됨
       */
      await createLecturePayment(paymentPayload);

      // 결제 완료 페이지로 이동
      router.push(
        `/classroom/${continentCode}/${countryId}/lecture/${courseId}/payment/single/complete`
      );
    } catch (error) {
      console.error(
        "❌ 결제 처리 실패:",
        error
      );

      // 백엔드 결제 API 오류
      if (error instanceof LecturePaymentError) {
        console.error("결제 API 오류 상세:", {
          status: error.status,
          code: error.code,
          message: error.message,
          traceId: error.traceId,
          responseData: error.responseData,
        });

        // 사용자가 보는 화면에는 간단한 문구만 표시
        if (error.status === 401) {
          setErrorMessage(
            "로그인이 필요합니다. 로그인 후 다시 결제해 주세요."
          );
        } else if (error.status === 403) {
          setErrorMessage(
            "결제를 진행할 권한이 없습니다."
          );
        } else if (error.status >= 500) {
          setErrorMessage(
            "결제 처리 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
          );
        } else {
          setErrorMessage(error.message);
        }

        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "결제 처리에 실패했습니다.";

      // 포트원 결제 취소
      if (
        message.includes("CANCELED") ||
        message.includes("취소")
      ) {
        setErrorMessage("결제가 취소되었습니다.");
        return;
      }

      setErrorMessage(message);
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8] text-sm text-gray-500">
        결제 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8] font-semibold text-red-500">
        {errorMessage ||
          "강의 데이터가 존재하지 않습니다."}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] px-4 py-12">
      <section className="mx-auto max-w-4xl space-y-5">
        <SubHeader
          backHref={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
          backText="강의로 돌아가기"
          title="결제하기"
          description="쿠폰과 마일리지를 적용한 뒤 결제를 진행해 주세요."
        />

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm">
            <div>
              <h2 className="mb-1 font-bold text-red-800">
                ⚠️ 결제에 실패했습니다
              </h2>

              <p className="mb-2 whitespace-pre-line text-gray-700">
                {errorMessage}
              </p>

              <p className="text-xs font-medium text-red-500">
                입력한 쿠폰과 마일리지를 확인하거나
                잠시 후 다시 시도해 주세요.
              </p>
            </div>
          </div>
        )}

        <CourseInfoCard
          title={course.title}
          description={course.description}
          price={price}
        />

        <CouponSelector
          coupons={coupons}
          selectedCouponId={selectedCouponId}
          onChange={(couponId) => {
            setSelectedCouponId(couponId);

            // 쿠폰이 변경되면 사용 마일리지 초기화
            setUsedMileage(0);
          }}
        />

        <MileageInput
          mileageBalance={mileageBalance}
          maxMileage={maxMileage}
          usedMileage={usedMileage}
          onChange={handleMileageChange}
        />

        <PaymentSummary
          price={price}
          couponDiscount={couponDiscount}
          usedMileage={usedMileage}
          finalAmount={finalAmount}
        />

        <PaymentButtons
          finalAmount={finalAmount}
          isPaying={isPaying}
          onBack={() => router.back()}
          onPay={handlePay}
        />
      </section>
    </main>
  );
}