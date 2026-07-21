"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPurchasedTrips } from "@/features/services/itinerary.service";
import type { PurchasedTripResponse } from "../types";

interface PurchasedTripPickerProps {
  selectedBookingId: number | null;
  onSelect: (bookingId: number) => void;
}

// tripType=BOOKING 선택지: 내가 구매한 예약 중 추천에 쓸 수 있는 것만 목록으로 보여준다
export default function PurchasedTripPicker({
  selectedBookingId,
  onSelect,
}: PurchasedTripPickerProps) {
  const [trips, setTrips] = useState<PurchasedTripResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const result = await getPurchasedTrips();
        if (active) setTrips(result);
      } catch (error) {
        if (!active) return;
        console.error("[aischedule] 구매 여행 목록 조회 실패:", error);
        setErrorMessage("구매한 여행 목록을 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <p className="rounded-2xl border border-[#E1E8EF] bg-white px-4 py-6 text-center text-sm text-[#8A9BB0]">
        구매한 여행을 불러오는 중입니다...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="rounded-2xl border border-[#F3D2D2] bg-[#FDECEC] px-4 py-3 text-sm text-[#B54747]">
        {errorMessage}
      </p>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E1E8EF] bg-white px-4 py-6 text-center">
        <p className="text-sm font-bold text-[#0A1628]">
          구매한 여행이 없습니다.
        </p>
        <p className="mt-1 text-xs text-[#8A9BB0]">
          패키지를 먼저 예약하시거나, 전체 패키지·자유 여행으로 일정을 만들어보세요.
        </p>
        <Link
          href="/packagelounge"
          className="mt-3 inline-block text-xs font-bold text-[#439A97] underline"
        >
          패키지 라운지 보러가기
        </Link>
      </div>
    );
  }

  return (
    <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
      {trips.map((trip) => {
        const selected = trip.bookingId === selectedBookingId;

        return (
          <li key={trip.bookingId}>
            <button
              type="button"
              onClick={() => onSelect(trip.bookingId)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                selected
                  ? "border-[#439A97] bg-[#EEF8F7]"
                  : "border-[#E1E8EF] bg-white hover:border-[#B7DAD7]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#0A1628]">
                  {trip.destination}
                </p>
                <p className="text-sm font-extrabold text-[#439A97]">
                  {trip.price.toLocaleString()}원
                </p>
              </div>
              {trip.accommodationName && (
                <p className="mt-0.5 text-xs text-[#718096]">
                  {trip.accommodationName}
                </p>
              )}
              <p className="mt-1 text-xs text-[#8A9BB0]">
                {trip.startDate} ~ {trip.endDate} · {trip.nights}박 ·{" "}
                {trip.bookingNumber}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
