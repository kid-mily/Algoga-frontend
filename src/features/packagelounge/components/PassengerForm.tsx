"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FIXED_NATIONALITY, FIXED_PASSPORT_TYPE } from "../booking.data";
import {
  getPassengerInfo,
  savePassengerInfo,
} from "../utils/passengerStorage";
import type { PassengerFormData, PassengerFormErrors } from "../booking.types";

const INITIAL_FORM: PassengerFormData = {
  lastName: "",
  firstName: "",
  gender: "",
  birthDate: "",
  nationality: FIXED_NATIONALITY,
  passportType: FIXED_PASSPORT_TYPE,
  passportNumber: "",
  expiryDate: "",
};

const REQUIRED_MESSAGE: Record<string, string> = {
  lastName: "성을 입력해 주세요.",
  firstName: "이름을 입력해 주세요.",
  gender: "성별을 입력해 주세요.",
  birthDate: "생년월일을 입력해 주세요.",
  passportNumber: "여권 번호를 입력해 주세요.",
  expiryDate: "여권 만료일을 입력해 주세요.",
};

const EXPIRED_PASSPORT_MESSAGE =
  "여행 종료일 이전에 여권이 만료됩니다. 여권을 재발급한 후 예약을 진행해 주세요.";

// 입력창의 "YYYY-MM-DD"와 패키지 데이터의 "YYYY.MM.DD" 형식을 모두 Date로 바꿔준다
const parseDate = (value: string) => {
  if (!value) return null;

  const date = new Date(value.replaceAll(".", "-"));
  return Number.isNaN(date.getTime()) ? null : date;
};

// 여권 만료일이 귀국일보다 이후인지 확인한다 (귀국일과 같은 날짜도 통과 불가)
const getExpiryDateError = (expiryDate: string, returnDate: string) => {
  if (!expiryDate) return REQUIRED_MESSAGE.expiryDate;

  const expiry = parseDate(expiryDate);
  const returnAt = parseDate(returnDate);

  if (!expiry || !returnAt) return REQUIRED_MESSAGE.expiryDate;

  return expiry > returnAt ? undefined : EXPIRED_PASSPORT_MESSAGE;
};

// 필수 입력 항목이 모두 채워지고, 여권 만료일도 유효한지 확인한다
const isPassengerFormComplete = (form: PassengerFormData, returnDate: string) => {
  const isRequiredFilled = Object.keys(REQUIRED_MESSAGE).every(
    (field) => form[field as keyof PassengerFormData].trim().length > 0
  );

  return isRequiredFilled && !getExpiryDateError(form.expiryDate, returnDate);
};

interface PassengerFormProps {
  // 예약한 패키지의 귀국일 ("YYYY.MM.DD") — 여권 만료일 검증 기준
  returnDate: string;
  // 필수 항목이 모두 채워졌는지 상위 컴포넌트(다음 버튼)에 알려준다
  onValidityChange?: (isValid: boolean) => void;
  // 값이 바뀔 때마다(1, 2, 3...) 빈 필수 항목을 모두 표시하고 첫 번째 항목으로 이동한다
  validateSignal?: number;
}

// 예약 02단계: 탑승객 정보 입력 폼
// 저장된 정보가 없으면 새로 입력받고, 있으면 자동으로 불러와 이어서 수정할 수 있다
export default function PassengerForm({
  returnDate,
  onValidityChange,
  validateSignal,
}: PassengerFormProps) {
  const [form, setForm] = useState<PassengerFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<PassengerFormErrors>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef(form);

  // 검증 시점에 최신 입력값을 참조할 수 있도록 ref에 항상 동기화해 둔다
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  // 이전에 저장해 둔 탑승객 정보가 있으면 불러와서 채워주고,
  // 불러온 여권 만료일도 귀국일 기준으로 다시 검증한다
  useEffect(() => {
    const saved = getPassengerInfo();
    if (!saved) return;

    setForm(saved);

    const expiryError = getExpiryDateError(saved.expiryDate, returnDate);
    if (expiryError) {
      setErrors((prev) => ({ ...prev, expiryDate: expiryError }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 입력값이 바뀔 때마다 필수 항목이 모두 채워졌는지 상위에 알려준다
  useEffect(() => {
    onValidityChange?.(isPassengerFormComplete(form, returnDate));
  }, [form, returnDate, onValidityChange]);

  // 다음 단계 버튼을 눌렀을 때(validateSignal 증가) 빈 필수 항목을 모두 보여주고
  // 첫 번째로 비어 있는(또는 유효하지 않은) 입력창으로 스크롤 + 포커스 이동한다
  useEffect(() => {
    if (!validateSignal) return;

    const currentForm = formRef.current;
    const nextErrors: PassengerFormErrors = {};
    let firstInvalidField: keyof PassengerFormData | null = null;

    (Object.keys(REQUIRED_MESSAGE) as (keyof PassengerFormData)[]).forEach(
      (field) => {
        const message =
          field === "expiryDate"
            ? getExpiryDateError(currentForm.expiryDate, returnDate)
            : currentForm[field].trim().length === 0
              ? REQUIRED_MESSAGE[field]
              : undefined;

        if (message) {
          nextErrors[field] = message;
          if (!firstInvalidField) firstInvalidField = field;
        }
      }
    );

    setErrors(nextErrors);

    if (firstInvalidField) {
      const target = containerRef.current?.querySelector<HTMLInputElement>(
        `[name="${firstInvalidField}"]`
      );
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.focus();
    }
  }, [validateSignal, returnDate]);

  const handleChange = (field: keyof PassengerFormData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      savePassengerInfo(next);
      return next;
    });

    // 여권 만료일은 수정할 때마다 바로 다시 검증한다
    if (field === "expiryDate") {
      setErrors((prev) => ({
        ...prev,
        expiryDate: getExpiryDateError(value, returnDate),
      }));
    }
  };

  const handleBlur = (field: keyof PassengerFormData) => {
    if (field === "expiryDate") {
      setErrors((prev) => ({
        ...prev,
        expiryDate: getExpiryDateError(form.expiryDate, returnDate),
      }));
      return;
    }

    const isEmpty = form[field].trim().length === 0;
    const message = REQUIRED_MESSAGE[field];

    if (!message) return;

    setErrors((prev) => ({ ...prev, [field]: isEmpty ? message : undefined }));
  };

  return (
    <section className="rounded-2xl border border-[#E1E8EF] bg-white p-5 shadow-[0_8px_24px_rgba(55,88,110,0.06)] sm:p-6">
      <span className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
        PASSENGER
      </span>
      <h2 className="mt-1 text-lg font-bold text-[#0A1628]">탑승객 정보</h2>

      <div ref={containerRef} className="mt-4">
        <div className="flex items-start gap-3 rounded-xl bg-[#EEF8F7] p-4">
          <Image
            src="/images/UserCyan.svg"
            alt="탑승객 정보"
            width={20}
            height={20}
            className="mt-0.5 shrink-0"
          />
          <p className="text-xs leading-5 text-[#0A1628]/80">
            여권에 표시된 영문 이름과 동일하게 입력해 주세요.
            <br />
            입력한 정보가 다르면 탑승이 제한될 수 있습니다.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
          <FormField
            name="lastName"
            label="성"
            required
            placeholder="여권 성 (영문)"
            value={form.lastName}
            error={errors.lastName}
            onChange={(value) => handleChange("lastName", value)}
            onBlur={() => handleBlur("lastName")}
          />
          <FormField
            name="firstName"
            label="이름"
            required
            placeholder="여권 이름 (영문)"
            value={form.firstName}
            error={errors.firstName}
            onChange={(value) => handleChange("firstName", value)}
            onBlur={() => handleBlur("firstName")}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
          <FormField
            name="gender"
            label="성별"
            required
            placeholder="예: M / F"
            value={form.gender}
            error={errors.gender}
            onChange={(value) => handleChange("gender", value)}
            onBlur={() => handleBlur("gender")}
          />
          <FormField
            name="birthDate"
            label="생년월일"
            required
            type="date"
            value={form.birthDate}
            error={errors.birthDate}
            onChange={(value) => handleChange("birthDate", value)}
            onBlur={() => handleBlur("birthDate")}
          />
          <ReadOnlyField label="국적" value={form.nationality} />
        </div>

        <div className="mt-4 grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
          <ReadOnlyField label="여권 종류" value={form.passportType} />
          <FormField
            name="passportNumber"
            label="여권 번호"
            required
            value={form.passportNumber}
            error={errors.passportNumber}
            onChange={(value) => handleChange("passportNumber", value)}
            onBlur={() => handleBlur("passportNumber")}
          />
          <FormField
            name="expiryDate"
            label="여권 만료일"
            required
            type="date"
            value={form.expiryDate}
            error={errors.expiryDate}
            onChange={(value) => handleChange("expiryDate", value)}
            onBlur={() => handleBlur("expiryDate")}
          />
        </div>
      </div>
    </section>
  );
}

interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "date";
  error?: string;
}

// 라벨 + 입력창 + 포커스 강조 + 오류 문구로 구성된 예약 폼 전용 입력 필드
function FormField({
  name,
  label,
  value,
  onChange,
  onBlur,
  required,
  placeholder,
  type = "text",
  error,
}: FormFieldProps) {
  // 필수 항목인데 비어 있거나(블러/제출 여부와 상관없이), 오류가 있으면 항상 빨간 테두리로 보여준다
  const isInvalid = (required && value.trim().length === 0) || Boolean(error);

  return (
    <div>
      <label className="text-xs font-bold text-[#0A1628]">
        {label}
        {required && <span className="ml-0.5 text-[#D9534F]">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={`mt-1 h-11 w-full rounded-lg border bg-white px-3 text-sm text-[#0A1628] outline-none transition ${
          isInvalid
            ? "border-[#D9534F] focus:border-[#D9534F] focus:shadow-[0_1px_0_0_#D9534F]"
            : "border-[#E1E8EF] focus:border-[#439A97] focus:shadow-[0_1px_0_0_#439A97]"
        }`}
      />
      {error && <p className="mt-1 text-xs text-[#D9534F]">{error}</p>}
    </div>
  );
}

// 입력창과 동일한 크기/모양이지만 수정할 수 없는 고정값 필드 (국적, 여권 종류)
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-bold text-[#0A1628]">{label}</label>
      <div className="mt-1 flex h-11 w-full cursor-not-allowed items-center rounded-lg border border-[#E1E8EF] bg-[#F3F8FC] px-3 text-sm text-[#0A1628]/60">
        {value}
      </div>
    </div>
  );
}
