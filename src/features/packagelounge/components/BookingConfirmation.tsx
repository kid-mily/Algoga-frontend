"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBookingDetail } from "@/features/services/package.service";
import { ApiRequestError } from "@/lib/api";
import type { BookingDetail } from "../types";
import { formatDateTime } from "../utils/payment";

interface BookingConfirmationProps {
  bookingId: string;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "결제 대기",
};

// 예약 생성 후 실제 예약 조회(GET /bookings/{id}) 결과를 보여주는 확인 화면
// 예약 조회는 로그인한 유저 전용 데이터라, 서버 컴포넌트가 아니라
// 여기(클라이언트)에서 직접 호출해야 브라우저의 로그인 쿠키가 자동으로 실린다
export default function BookingConfirmation({ bookingId }: BookingConfirmationProps) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadBooking = async () => {
      try {
        const result = await getBookingDetail(bookingId);
        if (active) setBooking(result);
      } catch (error) {
        if (!active) return;

        if (error instanceof ApiRequestError && error.status === 404) {
          setIsNotFound(true);
          return;
        }

        console.error("[packagelounge] 예약 조회 실패:", error);
        setErrorMessage("예약 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      }
    };

    void loadBooking();

    return () => {
      active = false;
    };
  }, [bookingId]);

  if (isNotFound) {
    return (
      <main className="min-h-screen bg-[#F6F8FB] px-4 py-16">
        <section className="mx-auto max-w-[520px] rounded-[20px] border border-[#E2EAF1] bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#172235]">
            예약 정보를 찾을 수 없습니다.
          </p>
          <Link
            href="/packagelounge"
            className="mt-6 inline-block h-11 rounded-xl bg-[#67A19E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#5A928F]"
          >
            패키지 라운지로 돌아가기
          </Link>
        </section>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-[#F6F8FB] px-4 py-16">
        <section className="mx-auto max-w-[520px] rounded-[20px] border border-[#E2EAF1] bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#172235]">{errorMessage}</p>
        </section>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[#F6F8FB] px-4 py-16">
        <section className="mx-auto max-w-[520px] rounded-[20px] border border-[#E2EAF1] bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm font-bold text-[#172235]">
            예약 정보를 불러오는 중입니다.
          </p>
        </section>
      </main>
    );
  }

  const statusLabel = STATUS_LABEL[booking.status] ?? booking.status;

  return (
    <main className="min-h-screen bg-[#F6F8FB] px-4 py-10">
      <div className="mx-auto max-w-[760px]">
        <Link href="/packagelounge" className="text-xs font-medium text-[#5B8BC9]">
          ← 패키지 라운지로 돌아가기
        </Link>

        <div className="mt-6 flex items-center gap-2">
          <span className="rounded-full bg-[#EEF8F7] px-3 py-1 text-xs font-bold text-[#439A97]">
            {statusLabel}
          </span>
          <span className="text-xs text-[#91A0B5]">{booking.bookingNumber}</span>
        </div>

        <h1 className="mt-3 text-xl font-bold text-[#111B2D]">예약이 접수되었습니다</h1>
        <p className="mt-2 text-xs text-[#91A0B5]">
          아래 내용을 확인하고 결제를 진행해 주세요.
        </p>

        <div className="mt-7 space-y-4">
          <InformationCard title="여행 일정">
            <DetailRow label="체크인" value={booking.checkInDate} />
            <DetailRow label="체크아웃" value={booking.checkOutDate} />
            <DetailRow label="숙박" value={`${booking.nights}박`} />
          </InformationCard>

          <InformationCard title="항공권 정보">
            {booking.flightInfo ? (
              <>
                <DetailRow
                  label="가는 편"
                  value={`${booking.flightInfo.airline} ${booking.flightInfo.flightNumber}`}
                />
                <DetailRow
                  label="출발"
                  value={`${booking.flightInfo.departure} · ${formatDateTime(booking.flightInfo.departureTime)}`}
                />
                <DetailRow
                  label="도착"
                  value={`${booking.flightInfo.arrival} · ${formatDateTime(booking.flightInfo.arrivalTime)}`}
                />
              </>
            ) : (
              <p className="text-xs text-[#98701B]">가는 편 항공권 정보가 없습니다.</p>
            )}

            {booking.returnFlightInfo ? (
              <>
                <DetailRow
                  label="오는 편"
                  value={`${booking.returnFlightInfo.airline} ${booking.returnFlightInfo.flightNumber}`}
                />
                <DetailRow
                  label="출발"
                  value={`${booking.returnFlightInfo.departure} · ${formatDateTime(booking.returnFlightInfo.departureTime)}`}
                />
                <DetailRow
                  label="도착"
                  value={`${booking.returnFlightInfo.arrival} · ${formatDateTime(booking.returnFlightInfo.arrivalTime)}`}
                />
              </>
            ) : (
              <p className="text-xs text-[#98701B]">오는 편 항공권 정보가 없습니다.</p>
            )}
          </InformationCard>

          {booking.passengerInfo && (
            <InformationCard title="탑승객 정보">
              <DetailRow
                label="영문 이름"
                value={`${booking.passengerInfo.lastName} ${booking.passengerInfo.firstName}`}
              />
              <DetailRow label="생년월일" value={booking.passengerInfo.birthDate} />
              <DetailRow label="여권 번호" value={booking.passengerInfo.passportNumber} />
              <DetailRow label="여권 만료일" value={booking.passengerInfo.passportExpiry} />
            </InformationCard>
          )}

          <InformationCard title="결제 금액">
            <DetailRow
              label="총 금액"
              value={`${booking.totalPrice.toLocaleString()}원`}
            />
            <DetailRow
              label="예약금"
              value={`${booking.depositPrice.toLocaleString()}원`}
            />
            <DetailRow
              label="잔금"
              value={`${booking.balancePrice.toLocaleString()}원`}
            />
            {booking.installmentAllowed && (
              <p className="rounded-xl border border-[#E8B63A] bg-[#FFF9E8] p-3 text-[11px] leading-5 text-[#8A6A18]">
                이 예약은 분할 결제(예약금 + 잔금)를 선택할 수 있습니다.
              </p>
            )}
          </InformationCard>
        </div>

        <button
          type="button"
          title="결제 API 명세 확인 후 연결합니다."
          className="mt-5 block w-full rounded-xl bg-[#67A19E] py-3 text-center text-sm font-bold text-white"
        >
          결제하기
        </button>
      </div>
    </main>
  );
}

function InformationCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E6EBF1] bg-white p-6 shadow-sm">
      <h2 className="text-sm font-bold text-[#142033]">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-8 text-xs">
      <span className="text-[#91A0B5]">{label}</span>
      <strong className="text-right text-[#172235]">{value}</strong>
    </div>
  );
}
