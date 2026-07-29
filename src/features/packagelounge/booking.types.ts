// 패키지 예약 페이지에서 사용하는 타입 모음

export interface PassengerFormData {
  lastName: string;
  firstName: string;
  gender: string;
  birthDate: string;
  nationality: string;
  passportType: string;
  passportNumber: string;
  expiryDate: string;
}

export type PassengerFormErrors = Partial<Record<keyof PassengerFormData, string>>;

export interface RefundPolicyItem {
  label: string;
  description: string;
  tone: "good" | "mid" | "bad";
}
