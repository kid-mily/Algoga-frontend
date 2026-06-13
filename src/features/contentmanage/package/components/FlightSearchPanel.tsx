"use client";

import { FormEvent, useState } from "react";
import LoadingSpinner from "@/features/common/LoadingSpinner";
import { useFlightSearch } from "../hooks/useFlightSearch";

export default function FlightSearchPanel() {
  const { flights, isSearching, error, submitSearch } = useFlightSearch();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [formError, setFormError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!origin.trim() || !destination.trim() || !departureDate) {
      const missingFields = [
        !origin.trim() ? "origin" : "",
        !destination.trim() ? "destination" : "",
        !departureDate ? "departureDate" : "",
      ].filter(Boolean);

      setFormError("필수 항목을 모두 입력해주세요.");
      console.warn("항공편 검색 필수값 누락:", missingFields);
      return;
    }

    setFormError("");
    submitSearch({
      origin: origin.trim(),
      destination: destination.trim(),
      departureDate,
      returnDate: returnDate || undefined,
      adults,
    });
  };

  return (
    <section className="mt-6 rounded-[20px] border border-[#E4E7EC] bg-white p-5">
      <header>
        <h2 className="text-[18px] font-bold text-[#111827]">항공편 검색</h2>
      </header>

      <form role="search" onSubmit={handleSubmit} className="mt-4 grid grid-cols-5 gap-3">
        <label>
          <span className="mb-2 block text-[13px] font-semibold text-[#344054]">출발지</span>
          <input
            value={origin}
            onChange={(event) => {
              setOrigin(event.target.value);
              setFormError("");
            }}
            placeholder="ICN"
            className="h-[42px] w-full rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
          />
        </label>
        <label>
          <span className="mb-2 block text-[13px] font-semibold text-[#344054]">도착지</span>
          <input
            value={destination}
            onChange={(event) => {
              setDestination(event.target.value);
              setFormError("");
            }}
            placeholder="NRT"
            className="h-[42px] w-full rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
          />
        </label>
        <label>
          <span className="mb-2 block text-[13px] font-semibold text-[#344054]">출발일</span>
          <input
            type="date"
            value={departureDate}
            onChange={(event) => {
              setDepartureDate(event.target.value);
              setFormError("");
            }}
            className="h-[42px] w-full rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
          />
        </label>
        <label>
          <span className="mb-2 block text-[13px] font-semibold text-[#344054]">귀국일</span>
          <input
            type="date"
            value={returnDate}
            onChange={(event) => setReturnDate(event.target.value)}
            className="h-[42px] w-full rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
          />
        </label>
        <label>
          <span className="mb-2 block text-[13px] font-semibold text-[#344054]">인원</span>
          <input
            type="number"
            min={1}
            value={adults}
            onChange={(event) => setAdults(Number(event.target.value || 1))}
            className="h-[42px] w-full rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
          />
        </label>

        <footer className="col-span-5 flex justify-end">
          <button
            type="submit"
            disabled={isSearching || !origin.trim() || !destination.trim() || !departureDate}
            className="h-[42px] rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            {isSearching ? "검색 중..." : "항공편 검색"}
          </button>
        </footer>
      </form>

      {formError && (
        <section role="alert" className="mt-4 rounded-[12px] bg-[#FEF2F2] p-4 text-[14px] text-[#DC2626]">
          {formError}
        </section>
      )}

      {error && (
        <section role="alert" className="mt-4 rounded-[12px] bg-[#FEF2F2] p-4 text-[14px] text-[#DC2626]">
          {error}
        </section>
      )}

      <section className="mt-5" aria-busy={isSearching}>
        {isSearching ? (
          <LoadingSpinner text="항공편을 검색하는 중입니다..." />
        ) : flights.length === 0 ? (
          <p className="rounded-[14px] bg-[#F9FAFB] p-5 text-center text-[14px] text-[#667085]">
            검색된 항공편이 없습니다.
          </p>
        ) : (
          <ol className="space-y-3">
            {flights.map((flight) => (
              <li key={flight.flightId} className="rounded-[14px] border border-[#E4E7EC] p-4">
                <article className="flex items-center justify-between gap-4">
                  <section>
                    <h3 className="text-[15px] font-bold text-[#111827]">
                      {flight.airline} {flight.flightNumber}
                    </h3>
                    <p className="mt-1 text-[13px] text-[#667085]">
                      {flight.origin} → {flight.destination}
                    </p>
                    <p className="mt-1 text-[13px] text-[#98A2B3]">
                      {flight.departureTime} - {flight.arrivalTime}
                    </p>
                  </section>
                  <strong className="text-[18px] text-[#439A97]">
                    {flight.price.toLocaleString()}원
                  </strong>
                </article>
              </li>
            ))}
          </ol>
        )}
      </section>
    </section>
  );
}
