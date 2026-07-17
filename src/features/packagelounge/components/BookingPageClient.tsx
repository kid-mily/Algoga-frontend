"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BookingHeader from "./BookingHeader";
import TravelSummary from "./TravelSummary";
import PassengerForm from "./PassengerForm";
import BookingPolicy from "./BookingPolicy";
import BookingPrice from "./BookingPrice";
import type { PackageDetailData } from "../packageDetail.types";
import type { PackageApiItem } from "../types";
import type { CourseItem } from "@/features/classroom/components/types";

interface BookingPageClientProps {
  data: PackageDetailData;
  packageItem: PackageApiItem;
  packageId: string;
  course: CourseItem | null; 
}

// 예약 페이지 전체를 조립하는 클라이언트 컴포넌트
// 탑승객 정보(PassengerForm)와 취소/환불 규정 동의(BookingPolicy) 상태를 여기서 관리하고,
// "결제 단계로 이동" 버튼을 조건이 안 채워진 채로 눌렀을 때 해당 영역에 오류를 보여주도록 연결한다
export default function BookingPageClient({
  data,
  packageItem,
  packageId,
  course,
}: BookingPageClientProps) {
  const [isPassengerValid, setIsPassengerValid] = useState(false);
  const [validateSignal, setValidateSignal] = useState(0);
  const [isAgreed, setIsAgreed] = useState(false);
  const [policySignal, setPolicySignal] = useState(0);

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href={`/packagelounge/${packageId}`}
          className="inline-flex items-center gap-2 text-sm text-[#718096] hover:text-[#0A1628]"
        >
          <Image src="/images/arrow.svg" alt="" width={16} height={16} />
          뒤로가기
        </Link>

        <div className="mt-4">
          <BookingHeader />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 왼쪽: 여행 정보 확인 → 탑승객 정보 → 예약 조건 확인 */}
          <div className="space-y-6 lg:col-span-2">
            <TravelSummary data={data} course={course} />
            <PassengerForm
              returnDate={data.endDate}
              onValidityChange={setIsPassengerValid}
              validateSignal={validateSignal}
            />
            <BookingPolicy
              onAgreedChange={setIsAgreed}
              validateSignal={policySignal}
            />
          </div>

          {/* 오른쪽: 예약 요약 + 결제 금액 (데스크톱에서만 sticky) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <BookingPrice
                data={data}
                packageItem={packageItem}
                packageId={packageId}
                course={course}
                isPassengerValid={isPassengerValid}
                isAgreed={isAgreed}
                onInvalidAttempt={() => setValidateSignal((prev) => prev + 1)}
                onPolicyInvalidAttempt={() =>
                  setPolicySignal((prev) => prev + 1)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
