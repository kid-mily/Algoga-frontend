"use client";

import { useEffect, useState } from "react";
import { getBookingDetail } from "@/features/services/package.service";
import type { CourseItem } from "@/features/classroom/components/types";
import type { PackageDetailData } from "../packageDetail.types";
import type { BookingDetail } from "../types";
import type { PaymentMethod } from "../paymentSuccess.types";
import { buildPaymentSuccessData } from "../paymentSuccess.data";
import PaymentSuccess from "./PaymentSuccess";

interface PaymentSuccessClientProps {
  packageData: PackageDetailData;
  course: CourseItem | null;
  paymentMode: PaymentMethod;
  bookingId: string;
  // usePackagePayment가 결제창에 실제로 띄웠던 finalAmount (쿠폰/마일리지 반영된 진짜 결제액)
  paidAmount: number | null;
}

// 예약 조회는 로그인 유저 전용 데이터라 서버가 아니라 여기(클라이언트)에서 직접 불러온다
// (브라우저 쿠키가 자동으로 실리도록) — 실제 예약 데이터를 써야 결제 금액이 정확해진다
export default function PaymentSuccessClient({
  packageData,
  course,
  paymentMode,
  bookingId,
  paidAmount,
}: PaymentSuccessClientProps) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const result = await getBookingDetail(bookingId);
        if (active) setBooking(result);
      } catch (error) {
        if (!active) return;
        console.error("[packagelounge] 결제 완료 예약 조회 실패:", error);
        setLoadErrorMessage(
          "예약 정보를 불러오지 못했습니다. 마이페이지 예약 내역에서 확인해 주세요."
        );
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [bookingId]);

  if (loadErrorMessage) {
    return (
      <section className="mx-auto w-full max-w-xl rounded-2xl border border-[#E1E8EF] bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-[#172235]">
          {loadErrorMessage}
        </p>
      </section>
    );
  }

  if (!booking) {
    return (
      <section className="mx-auto w-full max-w-xl rounded-2xl border border-[#E1E8EF] bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-bold text-[#172235]">
          결제 정보를 불러오는 중입니다.
        </p>
      </section>
    );
  }

  const data = buildPaymentSuccessData(paymentMode, packageData, {
    booking,
    course,
    paidAmount,
  });

  return <PaymentSuccess data={data} />;
}
