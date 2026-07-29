"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyItineraries } from "@/features/services/itinerary.service";
import type { ItinerarySummaryResponse } from "../types";

// 내 일정 추천 이력 목록 (GET /itineraries). slots는 안 내려오는 가벼운 응답이라
// 카드에는 요약 정보만 보여주고, 상세는 클릭 시 별도 조회한다
export default function ItineraryHistoryList() {
  const [itineraries, setItineraries] = useState<ItinerarySummaryResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const result = await getMyItineraries();
        if (active) setItineraries(result);
      } catch (error) {
        if (!active) return;
        console.error("[aischedule] 일정 추천 이력 조회 실패:", error);
        setErrorMessage("일정 추천 이력을 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold tracking-[0.16em] text-[#439A97]">
              AI SCHEDULE
            </span>
            <h1 className="mt-2 text-2xl font-extrabold text-[#0A1628] sm:text-3xl">
              내 일정 추천 이력
            </h1>
          </div>
          <Link
            href="/aischedule"
            className="shrink-0 rounded-xl border border-[#E1E8EF] bg-white px-3 py-2 text-xs font-bold text-[#0A1628] transition hover:bg-[#F3F8FC]"
          >
            새 일정 만들기
          </Link>
        </div>

        {isLoading ? (
          <p className="rounded-2xl border border-[#E1E8EF] bg-white px-4 py-10 text-center text-sm text-[#8A9BB0]">
            이력을 불러오는 중입니다...
          </p>
        ) : errorMessage ? (
          <p className="rounded-2xl border border-[#F3D2D2] bg-[#FDECEC] px-4 py-3 text-sm text-[#B54747]">
            {errorMessage}
          </p>
        ) : itineraries.length === 0 ? (
          <div className="rounded-2xl border border-[#E1E8EF] bg-white px-4 py-10 text-center">
            <p className="text-sm font-bold text-[#0A1628]">
              아직 추천받은 일정이 없습니다.
            </p>
            <Link
              href="/aischedule"
              className="mt-3 inline-block text-xs font-bold text-[#439A97] underline"
            >
              AI 일정 만들러 가기
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {itineraries.map((item) => (
              <li key={item.itineraryId}>
                <Link
                  href={`/aischedule/history/${item.itineraryId}`}
                  className="block rounded-2xl border border-[#E1E8EF] bg-white p-4 transition hover:border-[#B7DAD7] hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#0A1628]">
                      {item.destination}
                    </p>
                    <p className="text-sm font-extrabold text-[#439A97]">
                      {item.estimatedTotalCost.toLocaleString()}원
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-[#718096]">
                    {item.startDate} ~ {item.endDate} · {item.totalDays}일 ·{" "}
                    {item.purposeLabel}
                  </p>
                  <p className="mt-1 text-xs text-[#A0AEC0]">
                    {item.createdAt.slice(0, 10).replaceAll("-", ".")} 추천
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
