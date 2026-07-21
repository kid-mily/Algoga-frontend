"use client";

import { useCallback, useState } from "react";
import { recommendItinerary } from "@/features/services/itinerary.service";
import { ApiRequestError } from "@/lib/api";
import type {
  Companion,
  ItineraryErrorCode,
  ItineraryResponse,
  RecommendItineraryRequest,
  TravelPreference,
  TravelPurpose,
  TripType,
} from "../types";

// ITN_001(AI 서버 연결 실패/지연)만 재시도 안내로 문구를 바꾸고,
// 나머지는 서버가 이미 구체적인 사유를 message로 내려주므로 그대로 쓴다
const ITINERARY_ERROR_MESSAGE: Partial<Record<ItineraryErrorCode, string>> = {
  ITN_001: "AI 일정 생성 서버 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.",
};

export function useItineraryRecommend() {
  const [tripType, setTripType] = useState<TripType>("BOOKING");
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [packageId, setPackageId] = useState<number | null>(null);
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [preferences, setPreferences] = useState<TravelPreference[]>([]);
  const [purpose, setPurpose] = useState<TravelPurpose | null>(null);
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [budget, setBudget] = useState("");
  const [headcount, setHeadcount] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);

  const handleTripTypeChange = useCallback((nextTripType: TripType) => {
    setTripType(nextTripType);
    setErrorMessage("");
  }, []);

  const handleTogglePreference = useCallback((preference: TravelPreference) => {
    setPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((item) => item !== preference)
        : [...prev, preference]
    );
  }, []);

  // 서버 호출 전 프론트 선검증. 서버 규칙(ITN_002/003/005/006)과 같은 조건을 미리 걸러
  // 불필요한 요청을 막는다
  const validate = useCallback((): string | null => {
    if (tripType === "BOOKING" && !bookingId) {
      return "구매한 여행을 선택해 주세요.";
    }
    if (tripType === "PACKAGE" && !packageId) {
      return "패키지를 선택해 주세요.";
    }
    if (tripType === "FREE") {
      if (!destination.trim() || !startDate || !endDate) {
        return "목적지와 여행 기간(출발일·도착일)을 입력해 주세요.";
      }
      if (endDate < startDate) {
        return "도착일은 출발일과 같거나 이후여야 합니다.";
      }
    }

    if (preferences.length === 0) {
      return "여행 취향을 1개 이상 선택해 주세요.";
    }
    if (!purpose) {
      return "여행 목적을 선택해 주세요.";
    }
    if (!companion) {
      return "동행자를 선택해 주세요.";
    }

    const budgetValue = Number(budget);
    if (!budget || !Number.isFinite(budgetValue) || budgetValue <= 0) {
      return "총예산을 입력해 주세요.";
    }

    const headcountValue = Number(headcount);
    if (!headcount || !Number.isInteger(headcountValue) || headcountValue < 1) {
      return "인원수를 입력해 주세요.";
    }

    return null;
  }, [
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
  ]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setItinerary(null);

    try {
      const payload: RecommendItineraryRequest = {
        tripType,
        preferences,
        purpose: purpose as TravelPurpose,
        companion: companion as Companion,
        budget: Number(budget),
        headcount: Number(headcount),
        ...(tripType === "BOOKING" && { bookingId: bookingId as number }),
        ...(tripType === "PACKAGE" && { packageId: packageId as number }),
        ...(tripType === "FREE" && {
          destination: destination.trim(),
          startDate,
          endDate,
        }),
      };

      const result = await recommendItinerary(payload);
      setItinerary(result);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        const errorCode = (error.body as { errorCode?: string } | null)
          ?.errorCode as ItineraryErrorCode | undefined;
        setErrorMessage(
          (errorCode && ITINERARY_ERROR_MESSAGE[errorCode]) ||
            error.message ||
            "일정 생성에 실패했습니다."
        );
      } else {
        const message =
          error instanceof Error ? error.message : "일정 생성에 실패했습니다.";
        setErrorMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    validate,
    tripType,
    preferences,
    purpose,
    companion,
    budget,
    headcount,
    bookingId,
    packageId,
    destination,
    startDate,
    endDate,
  ]);

  const handleReset = useCallback(() => {
    setItinerary(null);
    setErrorMessage("");
  }, []);

  return {
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
  };
}
