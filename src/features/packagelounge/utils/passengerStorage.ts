import type { PassengerFormData } from "../booking.types";

// 예약 페이지에서 입력한 탑승객 정보를 세션에 저장/조회한다
const STORAGE_KEY = "algoga-package-passenger";

export function savePassengerInfo(data: PassengerFormData) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getPassengerInfo(): PassengerFormData | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as PassengerFormData;
  } catch {
    return null;
  }
}
