"use client";

import Link from "next/link";
import { useItineraryRecommend } from "../hooks/useItineraryRecommend";
import TripTypeTabs from "./TripTypeTabs";
import PurchasedTripPicker from "./PurchasedTripPicker";
import PackagePicker from "./PackagePicker";
import FreeTripForm from "./FreeTripForm";
import PreferenceForm from "./PreferenceForm";
import ItineraryLoadingState from "./ItineraryLoadingState";
import ItineraryResultView from "./ItineraryResultView";

// AI 일정 추천 페이지 전체를 조립하는 클라이언트 컴포넌트
export default function AiScheduleClient() {
  const {
    tripType,
    bookingId,
    packageId,
    destination,
    startDate,
    endDate,
    preferences,
    purpose,
    companion,
    budget,
    headcount,
    isSubmitting,
    errorMessage,
    itinerary,
    setBookingId,
    setPackageId,
    setDestination,
    setStartDate,
    setEndDate,
    setPurpose,
    setCompanion,
    setBudget,
    setHeadcount,
    handleTripTypeChange,
    handleTogglePreference,
    handleSubmit,
    handleReset,
  } = useItineraryRecommend();

  if (isSubmitting) {
    return (
      <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <ItineraryLoadingState />
        </div>
      </main>
    );
  }

  if (itinerary) {
    return (
      <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-[#0A1628]">
              AI 일정 추천 결과
            </h1>
            <div className="flex gap-2">
              <Link
                href="/aischedule/history"
                className="rounded-xl border border-[#E1E8EF] bg-white px-3 py-2 text-xs font-bold text-[#0A1628] transition hover:bg-[#F3F8FC]"
              >
                이전 추천 보기
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl bg-[#439A97] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#357F7C]"
              >
                새로 만들기
              </button>
            </div>
          </div>

          <ItineraryResultView itinerary={itinerary} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold tracking-[0.16em] text-[#439A97]">
              AI SCHEDULE
            </span>
            <h1 className="mt-2 text-2xl font-extrabold text-[#0A1628] sm:text-3xl">
              AI 일정 추천
            </h1>
            <p className="mt-2 text-sm text-[#718096]">
              여행 유형과 취향을 알려주시면 AI가 일자별 일정을 만들어드립니다.
            </p>
          </div>
          <Link
            href="/aischedule/history"
            className="shrink-0 rounded-xl border border-[#E1E8EF] bg-white px-3 py-2 text-xs font-bold text-[#0A1628] transition hover:bg-[#F3F8FC]"
          >
            이전 추천 보기
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <section className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
            <h2 className="text-sm font-bold text-[#0A1628]">여행 유형</h2>
            <div className="mt-3">
              <TripTypeTabs value={tripType} onChange={handleTripTypeChange} />
            </div>

            <div className="mt-4">
              {tripType === "BOOKING" && (
                <PurchasedTripPicker
                  selectedBookingId={bookingId}
                  onSelect={setBookingId}
                />
              )}
              {tripType === "PACKAGE" && (
                <PackagePicker
                  selectedPackageId={packageId}
                  onSelect={setPackageId}
                />
              )}
              {tripType === "FREE" && (
                <FreeTripForm
                  destination={destination}
                  startDate={startDate}
                  endDate={endDate}
                  onDestinationChange={setDestination}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                />
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
            <h2 className="text-sm font-bold text-[#0A1628]">여행 정보</h2>
            <div className="mt-3">
              <PreferenceForm
                preferences={preferences}
                purpose={purpose}
                companion={companion}
                budget={budget}
                headcount={headcount}
                onTogglePreference={handleTogglePreference}
                onPurposeChange={setPurpose}
                onCompanionChange={setCompanion}
                onBudgetChange={setBudget}
                onHeadcountChange={setHeadcount}
              />
            </div>
          </section>
        </div>

        {errorMessage && (
          <p className="mt-6 rounded-2xl border border-[#F3D2D2] bg-[#FDECEC] px-4 py-3 text-sm text-[#B54747]">
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={() => void handleSubmit()}
          className="mt-6 w-full rounded-2xl bg-[#439A97] py-3.5 text-sm font-bold text-white transition hover:bg-[#357F7C]"
        >
          ✨ AI 일정 만들기
        </button>
      </div>
    </main>
  );
}
