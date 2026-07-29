"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBooking } from "@/features/services/package.service";
import { getMyCourses } from "@/features/services/myCourse.service";
import { CreateBookingRequest, PackageApiItem } from "../types";
import { PackageDetailData } from "../packageDetail.types";
import { getPassengerInfo } from "../utils/passengerStorage";
import { buildQueryString } from "../utils/query";
import { CourseItem } from "@/features/classroom/components/types";
import { ApiRequestError } from "@/lib/api";
import { formatBalanceDueDate } from "../utils/payment";

interface BookingPriceProps {
  data: PackageDetailData;
  packageItem: PackageApiItem;
  packageId: string;
  course: CourseItem | null;
  isPassengerValid: boolean;    // 탑승객 정보 필수 항목이 모두 채워졌는지 여부
  isAgreed: boolean;  // 취소/환불 규정에 동의했는지 여부
  // 탑승객 정보가 비어 있는 채로 버튼을 눌렀을 때 호출 (탑승객 정보 쪽에 오류를 보여주기 위함)
  onInvalidAttempt: () => void;
  // 규정에 동의하지 않은 채로 버튼을 눌렀을 때 호출 (동의 체크박스 쪽에 오류를 보여주기 위함)
  onPolicyInvalidAttempt: () => void;
}

// 예약 요약 + 결제 금액 영역 (오른쪽 사이드 카드).
// 버튼은 항상 눌러볼 수 있고, 탑승객 정보가 비어 있거나 규정에 동의하지 않았으면 그쪽으로 안내한다.
// 다음 단계(결제 페이지)는 bookingId가 있어야 해서, 여기서 먼저 예약(POST /bookings)을 생성한다
export default function BookingPrice({
  data,
  packageItem,
  packageId,
  course,
  isPassengerValid,
  isAgreed,
  onInvalidAttempt,
  onPolicyInvalidAttempt,
}: BookingPriceProps) {
  const router = useRouter();
  const { booking } = data;
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // 완강하지 않은 유저가 패키지 예약을 시도할 때 (BK_004) - 안내 문구 + 강의 이어듣기 링크를 따로 보여준다
  const [isCompletionRequired, setIsCompletionRequired] = useState(false);

  // 2026-07-23 백엔드 확인 — 이미 보유(구매)한 강의는 패키지 예약 시 재청구하면 안 됨
  // (결제 단계의 bundle preview DUPLICATE_PAYMENT와 같은 신호를 여기서도 미리 확인해서
  // 예약 요약 금액이 실제 결제 금액과 어긋나지 않게 함)
  const [isCourseOwned, setIsCourseOwned] = useState(false);
  const [isCheckingOwnership, setIsCheckingOwnership] = useState(
    Boolean(course)
  );

  useEffect(() => {
    // course가 없으면 애초에 isCourseOwned/isCheckingOwnership 초기값(false)이 그대로 맞다.
    // course가 있으면 isCheckingOwnership 초기값이 이미 true라 여기서 다시 set할 필요 없음
    if (!course) return;

    let active = true;

    const checkOwnership = async () => {
      try {
        const { content } = await getMyCourses(0, 100);
        if (!active) return;
        setIsCourseOwned(
          content.some((myCourse) => myCourse.courseId === course.courseId)
        );
      } catch (error) {
        console.error("[packagelounge] 강의 보유 여부 확인 실패:", error);
      } finally {
        if (active) setIsCheckingOwnership(false);
      }
    };

    void checkOwnership();

    return () => {
      active = false;
    };
  }, [course]);

  // 강의를 아직 안 샀을 때만 패키지와 함께 청구한다. 이미 보유한 강의는 결제 금액에서 완전히 제외
  const hasUnpurchasedCourse = Boolean(course) && !isCourseOwned;
  const coursePrice = hasUnpurchasedCourse ? course!.price : 0;
  const totalWithCourse = booking.totalAmount + coursePrice;
  const firstPaymentAmount = booking.depositAmount + coursePrice;
  const balanceDueDate = formatBalanceDueDate(packageItem.checkInDate);
  // 2026-07-22 백엔드 확인 — 출발일이 지난 패키지는 예약 생성 자체가 서버에서 거절됨(BK_005).
  // 굳이 눌러서 에러를 받게 하지 않도록 프론트에서 미리 막는다(최종 검증은 서버가 함)
  const isDeparted = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(packageItem.checkInDate) < today;
  })();

  const handleClick = async () => {
    if (isDeparted) return;

    if (!isPassengerValid) {
      onInvalidAttempt();
      return;
    }

    if (!isAgreed) {
      onPolicyInvalidAttempt();
      return;
    }

    if (isCreating) return;

    const passenger = getPassengerInfo();
    if (!passenger) {
      onInvalidAttempt();
      return;
    }

    setIsCreating(true);
    setErrorMessage("");
    setIsCompletionRequired(false);

    try {
      const payload: CreateBookingRequest = {
        accommodationId: packageItem.accommodationId,
        packageId: packageItem.packageId,
        // 이미 보유한 강의는 백엔드가 예약에 강의를 저장하지도 않고 재청구 대상도 아니라 courseId를 안 보냄
        ...(hasUnpurchasedCourse ? { courseId: course!.courseId } : {}),
        flightInfo: packageItem.flightInfo,
        returnFlightInfo: packageItem.returnFlightInfo,
        passengerInfo: {
          lastName: passenger.lastName,
          firstName: passenger.firstName,
          gender: passenger.gender,
          birthDate: passenger.birthDate,
          nationality: passenger.nationality,
          passportNumber: passenger.passportNumber,
          passportExpiry: passenger.expiryDate,
        },
        flightPrice: packageItem.flightPrice,
        checkInDate: packageItem.checkInDate,
        checkOutDate: packageItem.checkOutDate,
        // 이미 강의를 완강/보유한 채로 들어온 경로는 COMPLETION(일시불 고정), 그 외엔 LOUNGE(분할 가능)
        bookingSource: course && isCourseOwned ? "COMPLETION" : "LOUNGE",
      };

      const bookingId = await createBooking(payload);
      const query = buildQueryString({
        bookingId,
        courseId: hasUnpurchasedCourse ? course!.courseId : undefined,
      });
      router.push(`/packagelounge/${packageId}/payment${query}`);
    } catch (error) {
      console.error("[packagelounge] 예약 생성 실패:", error);

      const errorCode =
        error instanceof ApiRequestError
          ? (error.body as { errorCode?: string } | null)?.errorCode
          : undefined;

      if (errorCode === "BK_004") {
        setIsCompletionRequired(true);
      } else if (errorCode === "BK_005") {
        setErrorMessage("출발일이 지나 예약할 수 없습니다.");
      } else {
        setErrorMessage("예약 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }

      setIsCreating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.08)] sm:p-6">
      <span className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
        BOOKING SUMMARY
      </span>
      <h2 className="mt-1 text-lg font-bold text-[#0A1628]">예약 요약</h2>

      <p className="mt-3 text-sm font-bold text-[#0A1628]">{booking.title}</p>
      <p className="mt-1 text-xs text-[#718096]">{booking.dateRange}</p>
      <p className="mt-0.5 text-xs text-[#718096]">
        {booking.duration} · {data.maxPeople}
      </p>

      <div className="mt-4 space-y-2 border-t border-[#E1E8EF] pt-4">
        <div className="flex items-center justify-between text-sm text-[#0A1628]">
          <span>항공권</span>
          <span className="font-bold">
            {booking.flightPrice.toLocaleString()}원
          </span>
        </div>
        <div className="border-t border-dashed border-[#D6E0E8]" />
        <div className="flex items-center justify-between text-sm text-[#0A1628]">
          <span>숙소</span>
          <span className="font-bold">
            {booking.stayPrice.toLocaleString()}원
          </span>
        </div>
        {hasUnpurchasedCourse && (
          <>
            <div className="border-t border-dashed border-[#D6E0E8]" />
            <div className="flex items-center justify-between text-sm text-[#0A1628]">
              <span>강의</span>
              <span className="font-bold">
                {course!.price.toLocaleString()}원
              </span>
            </div>
          </>
        )}
      </div>

      {course && isCourseOwned && (
        <p className="mt-2 text-xs text-[#357F7C]">
          이미 보유한 강의라 결제 금액에 포함되지 않습니다.
        </p>
      )}

      <div className="mt-4 rounded-xl bg-[#EEF8F7] p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#56706F]">일시불</span>
          <strong className="text-base text-[#439A97]">
            {totalWithCourse.toLocaleString()}원
          </strong>
        </div>
        {/* 완강 후(보유) 경로는 COMPLETION으로 예약돼 일시불만 가능해서, 헷갈릴 수 있는 분할 예상액은 안 보여준다 */}
        {!(course && isCourseOwned) && (
          <div className="mt-2 border-t border-dashed border-[#B7DAD7] pt-2 text-xs text-[#56706F]">
            <div className="flex items-center justify-between">
              <span>분할 1차</span>
              <strong className="text-[#0A1628]">
                {firstPaymentAmount.toLocaleString()}원
              </strong>
            </div>
            <p className="mt-1">
              2차 잔금 <strong>{booking.balanceAmount.toLocaleString()}원</strong> · {balanceDueDate}까지
            </p>
            {hasUnpurchasedCourse && (
              <p className="mt-1">강의 금액은 1차에 전액 포함됩니다.</p>
            )}
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-[#718096]">
        결제 방식 선택과 쿠폰·마일리지 적용은 다음 단계에서 진행합니다.
      </p>

      {isDeparted ? (
        <p className="mt-3 text-xs text-[#D9534F]">
          출발일이 지나 예약할 수 없습니다.
        </p>
      ) : isCompletionRequired ? (
        <div className="mt-3 rounded-xl border border-[#F3D2D2] bg-[#FDECEC] px-4 py-3 text-xs text-[#B54747]">
          <p>강의를 완강하셔야 패키지 예약이 가능합니다.</p>
          <Link
            href="/mypage/coursedetails"
            className="mt-1.5 inline-block font-bold underline"
          >
            강의 이어듣기
          </Link>
        </div>
      ) : (
        errorMessage && (
          <p className="mt-3 text-xs text-[#D9534F]">{errorMessage}</p>
        )
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={isCreating || isDeparted || isCheckingOwnership}
        className="mt-4 w-full rounded-xl bg-[#439A97] py-3 text-center text-sm font-bold text-white transition hover:bg-[#357F7C] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCreating
          ? "예약 생성 중..."
          : isCheckingOwnership
            ? "확인 중..."
            : "결제 단계로 이동"}
      </button>
    </div>
  );
}
