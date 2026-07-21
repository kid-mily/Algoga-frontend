"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getItineraryDetail } from "@/features/services/itinerary.service";
import { ApiRequestError } from "@/lib/api";
import type { ItineraryResponse } from "../types";
import ItineraryResultView from "./ItineraryResultView";

interface ItineraryDetailClientProps {
  itineraryId: string;
}

// 일정 추천 상세 (GET /itineraries/{id}). 본인 소유가 아니거나 없으면 404(ITN_004)
export default function ItineraryDetailClient({
  itineraryId,
}: ItineraryDetailClientProps) {
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const result = await getItineraryDetail(itineraryId);
        if (active) setItinerary(result);
      } catch (error) {
        if (!active) return;
        console.error("[aischedule] 일정 추천 상세 조회 실패:", error);

        const message =
          error instanceof ApiRequestError && error.status === 404
            ? "일정 정보를 찾을 수 없습니다."
            : "일정 정보를 불러오지 못했습니다.";
        setErrorMessage(message);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [itineraryId]);

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/aischedule/history"
          className="text-sm text-[#718096] hover:text-[#0A1628]"
        >
          ← 이력 목록으로
        </Link>

        <div className="mt-4">
          {isLoading ? (
            <p className="rounded-2xl border border-[#E1E8EF] bg-white px-4 py-10 text-center text-sm text-[#8A9BB0]">
              불러오는 중입니다...
            </p>
          ) : errorMessage ? (
            <p className="rounded-2xl border border-[#F3D2D2] bg-[#FDECEC] px-4 py-3 text-sm text-[#B54747]">
              {errorMessage}
            </p>
          ) : itinerary ? (
            <ItineraryResultView itinerary={itinerary} />
          ) : null}
        </div>
      </div>
    </main>
  );
}
