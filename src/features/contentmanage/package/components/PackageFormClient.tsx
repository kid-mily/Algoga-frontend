"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/components/CompleteModal";
import {
  createAdminPackage,
  getAdminPackage,
  getCountryAccommodations,
  updateAdminPackage,
} from "@/features/services/adminPackage.service";
import { getCourseCountries } from "@/features/services/adminCourse.service";
import { getErrorMessage } from "@/features/services/error.service";
import { useFlightSearch } from "../hooks/useFlightSearch";
import { Accommodation, CourseCountry, Flight } from "../types";
import { getCountryAirportCode, isKoreaCountry } from "../utils/flightDestinations";

type PackageFormClientProps = {
  mode: "create" | "edit";
  packageId?: string;
};

export default function PackageFormClient({
  mode,
  packageId,
}: PackageFormClientProps) {
  const router = useRouter();
  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [countryId, setCountryId] = useState("");
  const [accommodationId, setAccommodationId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [flightDestination, setFlightDestination] = useState("");
  const [flightDepartureDate, setFlightDepartureDate] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isLoadingAccommodations, setIsLoadingAccommodations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasSearchedFlight, setHasSearchedFlight] = useState(false);
  const [error, setError] = useState("");
  const [completeOpen, setCompleteOpen] = useState(false);
  const submitControllerRef = useRef<AbortController | null>(null);
  const {
    flights,
    isSearching,
    error: flightSearchError,
    submitSearch,
  } = useFlightSearch();

  const selectedAccommodation = useMemo(
    () =>
      accommodations.find(
        (accommodation) => String(accommodation.accommodationId) === accommodationId
      ),
    [accommodations, accommodationId]
  );
  const accommodationPrice = selectedAccommodation
    ? selectedAccommodation.pricePerNight * selectedAccommodation.nights
    : 0;
  const flightPrice = selectedFlight?.price ?? 0;
  const basePrice = accommodationPrice + flightPrice;
  const finalPrice = Math.max(
    0,
    Math.round(basePrice * ((100 - discountRate) / 100))
  );
  const showFlightSearchErrors = hasSubmitted || hasSearchedFlight;
  const countryError = hasSubmitted && !countryId ? "국가를 선택해주세요." : "";
  const accommodationError =
    hasSubmitted && !accommodationId ? "숙소를 선택해주세요." : "";
  const nameError =
    hasSubmitted && !name.trim() ? "패키지명을 입력해주세요." : "";
  const checkInDateError =
    hasSubmitted && !checkInDate ? "체크인 날짜를 선택해주세요." : "";
  const checkOutDateError =
    hasSubmitted && !checkOutDate ? "체크아웃 날짜를 선택해주세요." : "";
  const imageError =
    hasSubmitted && mode === "create" && !imageFile
      ? "패키지 이미지를 선택해주세요."
      : "";
  const flightDestinationError =
    showFlightSearchErrors && !flightDestination.trim()
      ? "항공 도착지를 선택해주세요."
      : "";
  const flightDepartureDateError =
    showFlightSearchErrors && !flightDepartureDate
      ? "항공 출발일을 선택해주세요."
      : "";
  const selectedFlightError =
    hasSubmitted && !selectedFlight ? "항공편을 검색한 뒤 선택해주세요." : "";
  const priceError =
    hasSubmitted && basePrice <= 0 ? "숙소와 항공 가격을 확인해주세요." : "";
  const flightDestinationOptions = useMemo(
    () =>
      countries
        .filter((country) => !isKoreaCountry(country))
        .map((country) => ({
          countryId: String(country.countryId),
          countryName: country.countryName,
          airportCode: getCountryAirportCode(country),
        })),
    [countries]
  );

  const handleCountryChange = (nextCountryId: string) => {
    setCountryId(nextCountryId);
    setSelectedFlight(null);

    const nextAirportCode =
      flightDestinationOptions.find((option) => option.countryId === nextCountryId)
        ?.airportCode ?? "";
    setFlightDestination(nextAirportCode);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const countryData = await getCourseCountries(controller.signal);
        if (controller.signal.aborted) return;
        setCountries(countryData);

        if (mode === "edit" && packageId) {
          const packageData = await getAdminPackage(packageId, controller.signal);
          if (controller.signal.aborted) return;
          setCountryId(String(packageData.countryId || countryData[0]?.countryId || ""));
          setAccommodationId(String(packageData.accommodationId || ""));
          setName(packageData.name);
          setDescription(packageData.description);
          setCheckInDate(packageData.checkInDate);
          setCheckOutDate(packageData.checkOutDate);
          setDiscountRate(0);
          setFlightDestination(packageData.arrival !== "-" ? packageData.arrival : "");
          setFlightDepartureDate(
            packageData.departureTime.includes("T")
              ? packageData.departureTime.slice(0, 10)
              : ""
          );
          if (packageData.flightInfo) {
            setSelectedFlight({
              ...packageData.flightInfo,
              price: packageData.flightPrice || packageData.flightInfo.price,
            });
          }
          return;
        }

        setCountryId(String(countryData[0]?.countryId || ""));
        const firstDestinationCountry = countryData.find(
          (country) => !isKoreaCountry(country)
        );
        setFlightDestination(
          firstDestinationCountry ? getCountryAirportCode(firstDestinationCountry) : ""
        );
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(fetchError, "패키지 정보를 불러오지 못했습니다."));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchInitialData();

    return () => {
      controller.abort();
    };
  }, [mode, packageId]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAccommodations = async () => {
      if (!countryId) {
        setAccommodations([]);
        setAccommodationId("");
        return;
      }

      try {
        setIsLoadingAccommodations(true);
        const data = await getCountryAccommodations(countryId, controller.signal);
        if (controller.signal.aborted) return;
        setAccommodations(data);
        setAccommodationId((prev) => {
          if (prev && data.some((item) => String(item.accommodationId) === prev)) {
            return prev;
          }

          return String(data[0]?.accommodationId || "");
        });
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(fetchError, "숙소 목록을 불러오지 못했습니다."));
        setAccommodations([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingAccommodations(false);
        }
      }
    };

    void fetchAccommodations();

    return () => {
      controller.abort();
    };
  }, [countryId]);

  useEffect(() => {
    return () => {
      submitControllerRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    if (
      !countryId ||
      !accommodationId ||
      !name.trim() ||
      !checkInDate ||
      !checkOutDate ||
      basePrice <= 0 ||
      (mode === "create" && !imageFile) ||
      !selectedFlight
    ) {
      return;
    }

    const payload = {
      countryId: Number(countryId),
      accommodationId: Number(accommodationId),
      name: name.trim(),
      description: description.trim(),
      price: finalPrice,
      flightDestination: selectedFlight.arrival,
      checkInDate,
      checkOutDate,
      image: imageFile,
    };

    submitControllerRef.current?.abort();
    const submitController = new AbortController();
    submitControllerRef.current = submitController;

    try {
      setIsSubmitting(true);
      setError("");

      if (mode === "edit" && packageId) {
        await updateAdminPackage(packageId, payload, submitController.signal);
      } else {
        await createAdminPackage(payload, submitController.signal);
      }

      if (submitController.signal.aborted) return;
      setCompleteOpen(true);
    } catch (submitError: unknown) {
      if (submitController.signal.aborted) return;
      setError(getErrorMessage(submitError, "패키지 저장에 실패했습니다."));
    } finally {
      if (!submitController.signal.aborted) {
        setIsSubmitting(false);
      }
    }
  };

  const handleFlightSearch = () => {
    setHasSearchedFlight(true);

    if (!flightDestination.trim() || !flightDepartureDate) {
      return;
    }

    setError("");
    setSelectedFlight(null);
    void submitSearch({
      destination: flightDestination.trim().toUpperCase(),
      departureDate: flightDepartureDate,
    });
  };

  if (isLoading) {
    return (
      <section className="rounded-[20px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        패키지 정보를 불러오는 중입니다...
      </section>
    );
  }

  return (
    <>
      <AdminErrorBanner message={error || flightSearchError} className="mb-4" />

      <form
        onSubmit={handleSubmit}
        className="rounded-[24px] border border-[#E4E7EC] bg-white"
      >
        <section className="grid grid-cols-2 gap-5 p-7">
          <label>
            <span className="text-[15px] font-semibold text-[#111827]">국가 *</span>
            <select
              value={countryId}
              onChange={(event) => handleCountryChange(event.target.value)}
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            >
              {countries.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.countryName}
                </option>
              ))}
            </select>
            {countryError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {countryError}
              </p>
            )}
          </label>

          <label>
            <span className="text-[15px] font-semibold text-[#111827]">숙소 *</span>
            <select
              value={accommodationId}
              onChange={(event) => setAccommodationId(event.target.value)}
              disabled={isLoadingAccommodations || accommodations.length === 0}
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none disabled:bg-[#F2F4F7]"
            >
              {accommodations.length === 0 ? (
                <option value="">등록된 숙소 없음</option>
              ) : (
                accommodations.map((accommodation) => (
                  <option
                    key={accommodation.accommodationId}
                    value={accommodation.accommodationId}
                  >
                    {accommodation.name}
                  </option>
                ))
              )}
            </select>
            {accommodationError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {accommodationError}
              </p>
            )}
          </label>

          <label className="col-span-2">
            <span className="text-[15px] font-semibold text-[#111827]">패키지명 *</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="일본 도쿄 3박 4일 패키지"
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
            {nameError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {nameError}
              </p>
            )}
          </label>

          <label>
            <span className="text-[15px] font-semibold text-[#111827]">체크인 날짜 *</span>
            <input
              type="date"
              value={checkInDate}
              onChange={(event) => setCheckInDate(event.target.value)}
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
            {checkInDateError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {checkInDateError}
              </p>
            )}
          </label>

          <label>
            <span className="text-[15px] font-semibold text-[#111827]">체크아웃 날짜 *</span>
            <input
              type="date"
              value={checkOutDate}
              min={checkInDate}
              onChange={(event) => setCheckOutDate(event.target.value)}
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
            {checkOutDateError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {checkOutDateError}
              </p>
            )}
          </label>

          <label>
            <span className="text-[15px] font-semibold text-[#111827]">할인율 *</span>
            <input
              type="number"
              min={0}
              max={100}
              value={discountRate}
              onChange={(event) =>
                setDiscountRate(Math.min(100, Math.max(0, Number(event.target.value))))
              }
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
            <p className="mt-2 text-[12px] text-[#98A2B3]">
              숙소와 항공 가격을 합산한 뒤 할인율을 적용합니다.
            </p>
          </label>

          <label>
            <span className="text-[15px] font-semibold text-[#111827]">
              패키지 이미지 {mode === "create" ? "*" : ""}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              className="mt-3 flex h-[52px] w-full items-center rounded-[16px] border border-[#E4E7EC] px-4 py-3 text-[14px] text-[#344054] file:mr-4 file:rounded-[10px] file:border-0 file:bg-[#E7F4EC] file:px-4 file:py-2 file:text-[13px] file:font-semibold file:text-[#439A97]"
            />
            {mode === "edit" && (
              <p className="mt-2 text-[12px] text-[#98A2B3]">
                새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
              </p>
            )}
            {imageError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {imageError}
              </p>
            )}
          </label>

          <section className="rounded-[16px] border border-[#E4E7EC] bg-[#F9FAFB] p-4">
            <h2 className="text-[15px] font-bold text-[#111827]">선택 숙소</h2>
            <p className="mt-2 text-[14px] text-[#667085]">
              {selectedAccommodation
                ? `${selectedAccommodation.name} | ${selectedAccommodation.nights}박 | ${selectedAccommodation.pricePerNight.toLocaleString()}원/박`
                : "숙소를 선택해주세요."}
            </p>
          </section>

          <section className="rounded-[16px] border border-[#E4E7EC] bg-[#F9FAFB] p-4">
            <h2 className="text-[15px] font-bold text-[#111827]">최종 가격</h2>
            <dl className="mt-2 space-y-1 text-[13px] text-[#667085]">
              <div className="flex justify-between">
                <dt>숙소</dt>
                <dd>{accommodationPrice.toLocaleString()}원</dd>
              </div>
              <div className="flex justify-between">
                <dt>항공</dt>
                <dd>{flightPrice.toLocaleString()}원</dd>
              </div>
              <div className="flex justify-between font-semibold text-[#344054]">
                <dt>할인 적용</dt>
                <dd>{discountRate}%</dd>
              </div>
              <div className="flex justify-between pt-1 text-[15px] font-bold text-[#111827]">
                <dt>최종</dt>
                <dd>{finalPrice.toLocaleString()}원</dd>
              </div>
            </dl>
            {priceError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {priceError}
              </p>
            )}
          </section>

          <label className="col-span-2">
            <span className="text-[15px] font-semibold text-[#111827]">설명</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="패키지 설명을 입력하세요"
              className="mt-3 h-[120px] w-full resize-none rounded-[16px] border border-[#E4E7EC] px-4 py-4 text-[15px] outline-none"
            />
          </label>

          <section className="col-span-2 rounded-[18px] border border-[#E4E7EC] bg-[#FCFCFD] p-5">
            <header>
              <h2 className="text-[17px] font-bold text-[#111827]">항공편 선택 *</h2>
              <p className="mt-1 text-[13px] text-[#667085]">
                ICN 출발 기준으로 외부 API 항공편을 검색한 뒤 패키지에 포함할 항공편을 선택합니다.
              </p>
            </header>

            <section
              role="search"
              aria-label="항공편 검색"
              className="mt-4 grid grid-cols-[1fr_1fr_auto] gap-3"
            >
              <label>
                <span className="mb-2 block text-[13px] font-semibold text-[#344054]">
                  항공 도착지
                </span>
                <select
                  value={flightDestination}
                  onChange={(event) => {
                    setFlightDestination(event.target.value);
                    setSelectedFlight(null);
                  }}
                  className="h-[44px] w-full rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
                >
                  <option value="">도착 국가를 선택해주세요</option>
                  {flightDestinationOptions.map((option) => (
                    <option
                      key={option.countryId}
                      value={option.airportCode}
                      disabled={!option.airportCode}
                    >
                      {option.countryName}
                      {option.airportCode ? ` (${option.airportCode})` : " (공항 코드 없음)"}
                    </option>
                  ))}
                </select>
                {flightDestinationError && (
                  <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                    {flightDestinationError}
                  </p>
                )}
              </label>

              <label>
                <span className="mb-2 block text-[13px] font-semibold text-[#344054]">
                  항공 출발일
                </span>
                <input
                  type="date"
                  value={flightDepartureDate}
                  onChange={(event) => setFlightDepartureDate(event.target.value)}
                  className="h-[44px] w-full rounded-[12px] border border-[#E4E7EC] px-3 text-[14px] outline-none"
                />
                {flightDepartureDateError && (
                  <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                    {flightDepartureDateError}
                  </p>
                )}
              </label>

              <button
                type="button"
                onClick={handleFlightSearch}
                disabled={isSearching}
                className="mt-[26px] h-[44px] rounded-[12px] bg-[#439A97] px-5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
              >
                {isSearching ? "검색 중..." : "항공편 검색"}
              </button>
            </section>

            <section className="mt-4">
              {selectedFlightError && (
                <p className="mb-3 text-[13px] font-medium text-[#DC2626]">
                  {selectedFlightError}
                </p>
              )}
              {isSearching ? (
                <p className="rounded-[14px] bg-white p-5 text-center text-[14px] text-[#667085]">
                  항공편을 검색하는 중입니다...
                </p>
              ) : flights.length === 0 ? (
                <p className="rounded-[14px] bg-white p-5 text-center text-[14px] text-[#667085]">
                  검색된 항공편이 없습니다.
                </p>
              ) : (
                <ol className="space-y-3">
                  {flights.map((flight) => {
                    const isSelected =
                      selectedFlight?.flightNumber === flight.flightNumber &&
                      selectedFlight?.departureTime === flight.departureTime;

                    return (
                      <li key={`${flight.flightNumber}-${flight.departureTime}`}>
                        <button
                          type="button"
                          onClick={() => setSelectedFlight(flight)}
                          className={`flex w-full items-center justify-between gap-4 rounded-[14px] border p-4 text-left transition ${
                            isSelected
                              ? "border-[#439A97] bg-[#E7F4EC]"
                              : "border-[#E4E7EC] bg-white hover:border-[#B7D8D6]"
                          }`}
                        >
                          <span>
                            <span className="block text-[15px] font-bold text-[#111827]">
                              {flight.airline} {flight.flightNumber}
                            </span>
                            <span className="mt-1 block text-[13px] text-[#667085]">
                              {flight.departure} → {flight.arrival} | {flight.duration}
                            </span>
                            <span className="mt-1 block text-[13px] text-[#98A2B3]">
                              {flight.departureTime} - {flight.arrivalTime}
                            </span>
                          </span>
                          <strong className="shrink-0 text-[17px] text-[#439A97]">
                            {flight.price.toLocaleString()}원
                          </strong>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          </section>
        </section>

        <footer className="flex items-center justify-end gap-3 border-t border-[#E4E7EC] px-7 py-5">
          <button
            type="button"
            onClick={() => router.push("/contentadmin/package")}
            className="h-[48px] rounded-[14px] border border-[#E4E7EC] px-7 text-[15px] font-semibold text-[#344054]"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[48px] rounded-[14px] bg-[#439A97] px-7 text-[15px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            {isSubmitting ? "저장 중..." : mode === "create" ? "등록하기" : "수정하기"}
          </button>
        </footer>
      </form>

      <CompleteModal
        open={completeOpen}
        title={mode === "create" ? "등록 완료" : "수정 완료"}
        description={
          mode === "create"
            ? "패키지 등록이 완료되었습니다."
            : "패키지 수정이 완료되었습니다."
        }
        buttonText="확인"
        onConfirm={() => router.push("/contentadmin/package")}
      />
    </>
  );
}
