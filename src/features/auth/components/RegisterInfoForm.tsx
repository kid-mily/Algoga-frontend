"use client";

import { useEffect, useState } from "react";

import FormLabel from "@/features/common/components/FormLabel";

import {  RegisterInfoFormProps  } from "../types";
import {
  emailRegex,
  validateRegisterInfoForm,
  validateRegisterUsername,
} from "../utils/registerValidators";
import { useEmailVerification } from "../hooks/useEmailVerification";
import { useUsernameDuplicateCheck } from "../hooks/useUsernameDuplicateCheck";
import { usePhoneDuplicateCheck } from "../hooks/usePhoneDuplicateCheck";


export default function RegisterInfoForm({
  formData,
  onChange,
  onNext,
  isLoading,
  serverError,
  setServerError,
  isSocialSignup = false,
}: RegisterInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEtcRoute, setIsEtcRoute] = useState(formData.signupPath !== "" && !["search", "social", "friend", "ad"].includes(formData.signupPath));
  const usernameCheck = useUsernameDuplicateCheck();
  const emailVerification = useEmailVerification();
  const phoneCheck = usePhoneDuplicateCheck();

  useEffect(() => {
    return () => {
      usernameCheck.reset();
      emailVerification.reset();
      phoneCheck.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 회원가입 제출이 실패해 특정 필드로 서버 에러가 도착하면, 그 필드의 확인/인증 상태만 초기화한다.
  // (다른 필드 문제로 실패한 경우엔 여기서 건드리지 않으므로 이메일 인증·아이디 확인 플래그가 유지된다.)
  useEffect(() => {
    if (serverError?.field === "phone") {
      phoneCheck.reset();
    } else if (serverError?.field === "username") {
      usernameCheck.reset();
    } else if (serverError?.field === "email") {
      // 이메일 중복(AUTH_001) / 인증 만료(AUTH_014) 모두 이메일 재인증이 필요하다.
      emailVerification.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverError?.field]);

  const setFieldError = (field: string) => (message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const validateForm = () => {
    const newErrors = validateRegisterInfoForm(formData, {
      isSocialSignup,
      isUsernameChecked: usernameCheck.isChecked,
      isEmailVerified: emailVerification.isVerified,
      isPhoneChecked: phoneCheck.isChecked,
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "etc") {
      setIsEtcRoute(true);
      onChange("signupPath", "");
    } else {
      setIsEtcRoute(false);
      onChange("signupPath", value);
    }
  };

  const handleUsernameChange = (value: string) => {
    usernameCheck.reset();
    onChange("username", value);
    setFieldError("username")(value ? validateRegisterUsername(value) : "");

    if (serverError?.field === "username" && setServerError) {
      setServerError({ field: "", message: "" });
    }
  };

  const handleEmailChange = (value: string) => {
    emailVerification.reset();
    onChange("email", value);

    if (serverError?.field === "email" && setServerError) {
      setServerError({ field: "", message: "" });
    }
  };

  const handlePhoneChange = (rawValue: string) => {
    const onlyNumber = rawValue.replace(/[^0-9]/g, "");
    let formatted = onlyNumber;
    if (onlyNumber.length < 4) {
      formatted = onlyNumber;
    } else if (onlyNumber.length < 8) {
      formatted = `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`;
    } else {
      formatted = `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3, 7)}-${onlyNumber.slice(7, 11)}`;
    }

    // 번호가 바뀌면 이전 중복확인 결과를 초기화한다 → 다시 "중복 확인"을 눌러야 하고,
    // "한 번 중복 뜨면 다른 번호에도 계속 중복 뜨는" 잔여 상태 버그가 재발하지 않는다.
    phoneCheck.reset();
    onChange("phone", formatted);

    // 전화번호를 바꾸면 이전 제출 실패의 중복 에러(잔여 상태)도 지운다.
    if (serverError?.field === "phone" && setServerError) {
      setServerError({ field: "", message: "" });
    }
  };

  const handleUsernameCheck = () => {
    void usernameCheck.check(formData.username, setFieldError("username"));
  };

  const handlePhoneCheck = () => {
    void phoneCheck.check(formData.phone, setFieldError("phone"));
  };

  const handleSendEmailCode = () => {
    void emailVerification.sendCode(formData.email, setFieldError("email"));
  };

  const handleVerifyEmailCode = () => {
    void emailVerification.verifyCode(formData.email, setFieldError("emailCode"));
  };

  return (
    <div className="mt-3 w-full rounded-[35px] bg-white p-8 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      <h2 className="text-[25px] font-bold text-[#111827]">기본 정보 입력</h2>

      <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4">
        {/* 이름 */}
        <div className={isSocialSignup ? "col-span-2" : ""}>
          <FormLabel required>성명</FormLabel>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="홍길동"
            className="h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
            disabled={isLoading || (isSocialSignup && Boolean(formData.name))}
          />
          {errors.name && <p className="mt-1 text-[13px] text-red-500">{errors.name}</p>}
        </div>

        {!isSocialSignup && (
          <div>
          <FormLabel required>아이디</FormLabel>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="영문·숫자 4~20자"
              maxLength={20}
              autoCapitalize="none"
              className="h-[35px] min-w-0 flex-1 rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleUsernameCheck}
              disabled={
                isLoading ||
                usernameCheck.isChecking ||
                !formData.username.trim()
              }
              aria-label={
                usernameCheck.isChecking
                  ? "중복 확인: 사용자 이름 검사 중"
                  : "중복 확인: 사용자 이름 검사"
              }
              className="h-[35px] shrink-0 rounded-[14px] bg-[#439A97] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
            >
              {usernameCheck.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {errors.username && <p className="mt-1 text-[13px] text-red-500">{errors.username}</p>}
          {!errors.username && usernameCheck.message && (
            <p aria-live="polite" className="mt-1 text-[13px] text-[#439A97]">
              {usernameCheck.message}
            </p>
          )}

          {/* 아이디 중복 관련 백엔드 에러 표시 */}
          {serverError?.field === "username" && !errors.username && (
            <p className="mt-1 text-[13px] text-red-500">{serverError.message}</p>
          )}
          </div>
        )}

        {!isSocialSignup && (
          <div>
            <FormLabel required>비밀번호</FormLabel>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => onChange("password", e.target.value)}
            placeholder="8자 이상 영문, 숫자 조합"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
            disabled={isLoading}
          />
          {errors.password ? (
              <p className="mt-1 text-[13px] text-red-500">{errors.password}</p>
          ) : (
              <p className="mt-3 text-[13px] text-[#98A2B3]">최소 8자 이상 / 영문, 숫자 포함</p>
          )}
          </div>
        )}

        {!isSocialSignup && (
          <div>
            <FormLabel required>비밀번호 확인</FormLabel>
          <input
            type="password"
            value={formData.passwordConfirm}
            onChange={(e) => onChange("passwordConfirm", e.target.value)}
            placeholder="재입력"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
            disabled={isLoading}
          />
          {errors.passwordConfirm && <p className="mt-1 text-[13px] text-red-500">{errors.passwordConfirm}</p>}
          </div>
        )}

        {/* 닉네임 */}
        <div className="col-span-2">
          <FormLabel required>닉네임</FormLabel>
          <input
            type="text"
            value={formData.nickname}
            onChange={(e) => onChange("nickname", e.target.value)}
            placeholder="사용하실 닉네임을 입력해주세요"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
            disabled={isLoading}
          />
          {errors.nickname && <p className="mt-1 text-[13px] text-red-500">{errors.nickname}</p>}
        </div>

        {/*  이메일 */}
        <div className="col-span-2">
          <FormLabel required>이메일</FormLabel>
          <div className="mt-3 flex gap-2">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="example@algoga.com"
              aria-invalid={emailVerification.isDuplicated || !!errors.email}
              className={`h-[35px] min-w-0 flex-1 rounded-[16px] border bg-[#F9FAFB] px-5 text-[15px] outline-none ${
                emailVerification.isDuplicated
                  ? "border-red-500 ring-1 ring-red-100"
                  : "border-[#D0D5DD]"
              }`}
              disabled={isLoading || emailVerification.isVerified || (isSocialSignup && Boolean(formData.email))}
            />

            {/* 소셜로그인 */}
            {!isSocialSignup && (
              <button
                type="button"
                onClick={handleSendEmailCode}
                disabled={
                  isLoading ||
                  emailVerification.isSending ||
                  emailVerification.isDuplicated ||
                  emailVerification.isVerified ||
                  !emailRegex.test(formData.email)
                }
                aria-label={
                  emailVerification.isSending
                    ? "인증: 이메일 인증번호 발송 중"
                    : "인증: 이메일 인증번호 발송"
                }
                className="h-[35px] shrink-0 rounded-[14px] bg-[#439A97] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
              >
                {emailVerification.isSending ? "발송 중" : emailVerification.isCodeSent ? "재발송" : "인증"}
              </button>
            )}
          </div>

          {/* 프론트엔드 자체 에러 (형식 등) */}
          {errors.email && <p className="mt-1 text-[13px] text-red-500">{errors.email}</p>}
          {!errors.email && emailVerification.message && (
            <p
              aria-live="polite"
              className={`mt-1 text-[13px] ${emailVerification.isVerified ? "text-[#439A97]" : "text-[#667085]"}`}
            >
              {emailVerification.message}
            </p>
          )}

          {/*  이메일 중복 관련 백엔드 에러 표시 */}
          {serverError?.field === "email" && !errors.email && (
            <p className="mt-1 text-[13px] text-red-500">{serverError.message}</p>
          )}

          {emailVerification.isCodeSent && !emailVerification.isVerified && !isSocialSignup && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={emailVerification.code}
                onChange={(e) => {
                  emailVerification.setCode(e.target.value);
                  setFieldError("emailCode")("");
                }}
                placeholder="인증번호 입력"
                className="h-[35px] min-w-0 flex-1 rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
                disabled={isLoading || emailVerification.isVerifying}
              />
              <button
                type="button"
                onClick={handleVerifyEmailCode}
                disabled={isLoading || emailVerification.isVerifying || !emailVerification.code.trim()}
                aria-label={
                  emailVerification.isVerifying
                    ? "확인: 이메일 인증번호 확인 중"
                    : "확인: 이메일 인증번호 확인"
                }
                className="h-[35px] shrink-0 rounded-[14px] bg-[#439A97] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
              >
                {emailVerification.isVerifying ? "확인 중" : "확인"}
              </button>
            </div>
          )}
          {errors.emailCode && <p className="mt-1 text-[13px] text-red-500">{errors.emailCode}</p>}
        </div>

        {/* 전화번호 */}
        <div className="col-span-2">
          <FormLabel required>전화번호</FormLabel>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="010-0000-0000"
              aria-invalid={serverError?.field === "phone" || !!errors.phone}
              className="h-[35px] min-w-0 flex-1 rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handlePhoneCheck}
              disabled={isLoading || phoneCheck.isChecking || !formData.phone.trim()}
              aria-label={
                phoneCheck.isChecking
                  ? "중복 확인: 전화번호 검사 중"
                  : "중복 확인: 전화번호 검사"
              }
              className="h-[35px] shrink-0 rounded-[14px] bg-[#439A97] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
            >
              {phoneCheck.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {errors.phone && <p className="mt-1 text-[13px] text-red-500">{errors.phone}</p>}
          {!errors.phone && phoneCheck.message && (
            <p aria-live="polite" className="mt-1 text-[13px] text-[#439A97]">
              {phoneCheck.message}
            </p>
          )}

          {/* 전화번호 중복 관련 백엔드 에러 표시 */}
          {serverError?.field === "phone" && !errors.phone && (
            <p className="mt-1 text-[13px] text-red-500">{serverError.message}</p>
          )}
        </div>

        {/* 생년월일 */}
        <div>
          <FormLabel required>생년월일</FormLabel>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => onChange("birthDate", e.target.value)}
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
            disabled={isLoading}
          />
          {errors.birthDate && <p className="mt-1 text-[13px] text-red-500">{errors.birthDate}</p>}
        </div>

        {/* 성별 */}
        <div>
          <FormLabel required>성별</FormLabel>
          <select
            value={formData.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
            disabled={isLoading}
          >
            <option value="">선택해주세요</option>
            <option value="MALE">남자</option>
            <option value="FEMALE">여자</option>
            <option value="OTHER">기타</option>
          </select>
          {errors.gender && <p className="mt-1 text-[13px] text-red-500">{errors.gender}</p>}
        </div>

        {/* 추천인 코드 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">추천인 코드 (선택)</label>
          <input
            type="text"
            value={formData.referralCode}
            onChange={(e) => onChange("referralCode", e.target.value)}
            placeholder="추천인 코드 입력"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
            disabled={isLoading}
          />
        </div>

        <div />

        {/* 유입 경로 */}
        <div className="col-span-2">
          <label className="text-[16px] font-semibold text-[#111827]">유입 경로 (선택)</label>
          <select
            value={isEtcRoute ? "etc" : formData.signupPath}
            onChange={handleRouteChange}
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
            disabled={isLoading}
          >
            <option value="">선택해주세요</option>
            <option value="search">검색 엔진</option>
            <option value="social">소셜 미디어</option>
            <option value="friend">지인 추천</option>
            <option value="ad">광고</option>
            <option value="etc">기타</option>
          </select>

          {isEtcRoute && (
            <input
              type="text"
              value={formData.signupPath}
              onChange={(e) => onChange("signupPath", e.target.value)}
              placeholder="유입 경로를 직접 입력해주세요"
              className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
              disabled={isLoading}
            />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNextClick}
        disabled={isLoading}
        aria-label={isLoading ? "다음 단계 이동 준비 중" : "다음 단계로 이동"}
        className={`mt-8 h-[43px] w-full rounded-[18px] text-[18px] font-semibold text-white transition ${
          isLoading ? "bg-[#D0D5DD] cursor-not-allowed" : "bg-[#439A97] hover:bg-[#357c7a]"
        }`}
      >
        {isLoading ? "확인 중..." : "다음"}
      </button>
    </div>
  );
}
