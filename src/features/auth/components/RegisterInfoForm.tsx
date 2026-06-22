"use client";

import { useEffect, useRef, useState } from "react";
import {
  checkUsernameDuplicate,
  sendSignupEmailCode,
  verifySignupEmailCode,
} from "@/features/services/signup.service";

import FormLabel from "@/features/common/components/FormLabel";

interface RegisterFormData {
  name: string;
  username: string;
  password: string;
  passwordConfirm: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  nickname: string;
  socialType?: string;
  referralCode: string;
  signupPath: string;
}

interface RegisterInfoFormProps {
  formData: RegisterFormData;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  isLoading?: boolean;
  serverError?: { field: string; message: string }; // 🌟 객체 형태로 변경
  setServerError?: (err: { field: string; message: string }) => void; // 🌟 객체 형태로 변경
  isSocialSignup?: boolean;
}

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
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [isVerifyingEmailCode, setIsVerifyingEmailCode] = useState(false);
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailDuplicated, setIsEmailDuplicated] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const usernameCheckControllerRef = useRef<AbortController | null>(null);
  const emailCodeControllerRef = useRef<AbortController | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isAbortError = (error: unknown) => {
    return error instanceof DOMException && error.name === "AbortError";
  };

  useEffect(() => {
    return () => {
      usernameCheckControllerRef.current?.abort();
      emailCodeControllerRef.current?.abort();
    };
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "이름은 필수입니다.";

    if (!isSocialSignup && (!formData.username || formData.username.length < 4 || formData.username.length > 20)) {
      newErrors.username = "아이디는 4자 이상 20자 이하로 입력해주세요.";
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!isSocialSignup && (!formData.password || !passwordRegex.test(formData.password))) {
      newErrors.password = "비밀번호는 영문, 숫자 조합 8자 이상이어야 합니다.";
    }

    if (!isSocialSignup && formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!isSocialSignup && !newErrors.username && !isUsernameChecked) {
      newErrors.username = "아이디 중복 확인을 완료해주세요.";
    }

    if (!isSocialSignup && !newErrors.email && !isEmailVerified) {
      newErrors.email = "이메일 인증을 완료해주세요.";
    }

    const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)";
    }

    if (!formData.birthDate) newErrors.birthDate = "생년월일은 필수입니다.";

    if (!formData.gender) newErrors.gender = "성별은 필수입니다.";

    if (!formData.nickname || formData.nickname.length > 50) {
      newErrors.nickname = "닉네임은 필수이며 50자 이내여야 합니다.";
    }

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
    usernameCheckControllerRef.current?.abort();
    setIsCheckingUsername(false);
    onChange("username", value);
    setIsUsernameChecked(false);
    setUsernameMessage("");

    if (serverError?.field === "username" && setServerError) {
      setServerError({ field: "", message: "" });
    }
  };

  const handleEmailChange = (value: string) => {
    emailCodeControllerRef.current?.abort();
    setIsSendingEmailCode(false);
    onChange("email", value);
    setIsEmailCodeSent(false);
    setIsEmailVerified(false);
    setIsEmailDuplicated(false);
    setEmailCode("");
    setEmailMessage("");

    if (serverError?.field === "email" && setServerError) {
      setServerError({ field: "", message: "" });
    }
  };

  const handleUsernameCheck = async () => {
    const username = formData.username.trim();

    if (username.length < 4 || username.length > 20) {
      setErrors((prev) => ({
        ...prev,
        username: "아이디는 4자 이상 20자 이하로 입력해주세요.",
      }));
      return;
    }

    usernameCheckControllerRef.current?.abort();
    const controller = new AbortController();
    usernameCheckControllerRef.current = controller;

    try {
      setIsCheckingUsername(true);
      setUsernameMessage("");
      setErrors((prev) => ({ ...prev, username: "" }));

      const isAvailable = await checkUsernameDuplicate(
        username,
        controller.signal
      );

      if (controller.signal.aborted) return;

      if (!isAvailable) {
        setIsUsernameChecked(false);
        setUsernameMessage("");
        setErrors((prev) => ({
          ...prev,
          username: "이미 사용 중인 아이디입니다.",
        }));
        return;
      }

      setIsUsernameChecked(true);
      setUsernameMessage("사용 가능한 아이디입니다.");
    } catch (error: unknown) {
      if (isAbortError(error) || controller.signal.aborted) return;

      const message =
        error instanceof Error
          ? error.message
          : "아이디 중복 확인에 실패했습니다.";

      setIsUsernameChecked(false);
      setUsernameMessage("");
      setErrors((prev) => ({
        ...prev,
        username: message,
      }));
    } finally {
      if (!controller.signal.aborted) {
        setIsCheckingUsername(false);
      }
    }
  };

  const handleSendEmailCode = async () => {
    const email = formData.email.trim();

    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식을 입력해주세요.",
      }));
      return;
    }

    emailCodeControllerRef.current?.abort();
    const controller = new AbortController();
    emailCodeControllerRef.current = controller;

    try {
      setIsSendingEmailCode(true);
      setIsEmailDuplicated(false);
      setIsEmailVerified(false);
      setEmailCode("");
      setEmailMessage("");
      setErrors((prev) => ({ ...prev, email: "" }));

      await sendSignupEmailCode(email, controller.signal);

      if (controller.signal.aborted) return;

      setIsEmailCodeSent(true);
      setEmailMessage("인증번호를 이메일로 보냈습니다.");
    } catch (error: unknown) {
      if (isAbortError(error) || controller.signal.aborted) return;

      const message =
        error instanceof Error
          ? error.message
          : "이메일 인증번호 발송에 실패했습니다.";
      const duplicated = /이미|가입|중복|존재|사용/.test(message);

      setIsEmailCodeSent(false);
      setIsEmailVerified(false);
      setIsEmailDuplicated(duplicated);
      setEmailMessage("");
      setErrors((prev) => ({
        ...prev,
        email: duplicated ? "이미 가입된 이메일입니다." : message,
      }));
    } finally {
      if (!controller.signal.aborted) {
        setIsSendingEmailCode(false);
      }
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!emailCode.trim()) {
      setEmailMessage("");
      setErrors((prev) => ({
        ...prev,
        emailCode: "인증번호를 입력해주세요.",
      }));
      return;
    }

    try {
      setIsVerifyingEmailCode(true);
      setErrors((prev) => ({ ...prev, emailCode: "" }));

      await verifySignupEmailCode(formData.email.trim(), emailCode.trim());
      setIsEmailVerified(true);
      setEmailMessage("이메일 인증이 완료되었습니다.");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "인증번호 확인에 실패했습니다.";

      setIsEmailVerified(false);
      setEmailMessage("");
      setErrors((prev) => ({
        ...prev,
        emailCode: message,
      }));
    } finally {
      setIsVerifyingEmailCode(false);
    }
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
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
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
              placeholder="4자 이상 20자 이하"
              className="h-[35px] min-w-0 flex-1 rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleUsernameCheck}
              disabled={isLoading || isCheckingUsername || !formData.username.trim()}
              aria-label={
                isCheckingUsername
                  ? "중복 확인: 사용자 이름 검사 중"
                  : "중복 확인: 사용자 이름 검사"
              }
              className="h-[35px] shrink-0 rounded-[14px] bg-[#439A97] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
            >
              {isCheckingUsername ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {errors.username && <p className="mt-1 text-[13px] text-red-500">{errors.username}</p>}
          {!errors.username && usernameMessage && (
            <p aria-live="polite" className="mt-1 text-[13px] text-[#439A97]">
              {usernameMessage}
            </p>
          )}
          {/* 🌟 아이디 중복 관련 백엔드 에러 표시 */}
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

        {/* 🌟 이메일 */}
        <div className="col-span-2">
          <FormLabel required>이메일</FormLabel>
          <div className="mt-3 flex gap-2">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="example@algoga.com"
              aria-invalid={isEmailDuplicated || !!errors.email}
              className={`h-[35px] min-w-0 flex-1 rounded-[16px] border bg-[#F9FAFB] px-5 text-[15px] outline-none ${
                isEmailDuplicated
                  ? "border-red-500 ring-1 ring-red-100"
                  : "border-[#D0D5DD]"
              }`}
              disabled={isLoading || isEmailVerified || (isSocialSignup && Boolean(formData.email))}
            />
            {!isSocialSignup && (
              <button
                type="button"
                onClick={handleSendEmailCode}
                disabled={
                  isLoading ||
                  isSendingEmailCode ||
                  isEmailDuplicated ||
                  isEmailVerified ||
                  !emailRegex.test(formData.email)
                }
                aria-label={
                  isSendingEmailCode
                    ? "인증: 이메일 인증번호 발송 중"
                    : "인증: 이메일 인증번호 발송"
                }
                className="h-[35px] shrink-0 rounded-[14px] bg-[#439A97] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
              >
                {isSendingEmailCode ? "발송 중" : isEmailCodeSent ? "재발송" : "인증"}
              </button>
            )}
          </div>
          {/* 프론트엔드 자체 에러 (형식 등) */}
          {errors.email && <p className="mt-1 text-[13px] text-red-500">{errors.email}</p>}
          {!errors.email && emailMessage && (
            <p
              aria-live="polite"
              className={`mt-1 text-[13px] ${isEmailVerified ? "text-[#439A97]" : "text-[#667085]"}`}
            >
              {emailMessage}
            </p>
          )}
          
          {/* 🌟 이메일 중복 관련 백엔드 에러 표시 */}
          {serverError?.field === "email" && !errors.email && (
            <p className="mt-1 text-[13px] text-red-500">{serverError.message}</p>
          )}

          {isEmailCodeSent && !isEmailVerified && !isSocialSignup && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={emailCode}
                onChange={(e) => {
                  setEmailCode(e.target.value);
                  setErrors((prev) => ({ ...prev, emailCode: "" }));
                }}
                placeholder="인증번호 입력"
                className="h-[35px] min-w-0 flex-1 rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
                disabled={isLoading || isVerifyingEmailCode}
              />
              <button
                type="button"
                onClick={handleVerifyEmailCode}
                disabled={isLoading || isVerifyingEmailCode || !emailCode.trim()}
                aria-label={
                  isVerifyingEmailCode
                    ? "확인: 이메일 인증번호 확인 중"
                    : "확인: 이메일 인증번호 확인"
                }
                className="h-[35px] shrink-0 rounded-[14px] bg-[#439A97] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
              >
                {isVerifyingEmailCode ? "확인 중" : "확인"}
              </button>
            </div>
          )}
          {errors.emailCode && <p className="mt-1 text-[13px] text-red-500">{errors.emailCode}</p>}
        </div>

        {/* 전화번호 */}
        <div className="col-span-2">
          <FormLabel required>전화번호</FormLabel>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => {
              const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
              let formatted = onlyNumber;
              if (onlyNumber.length < 4) {
                formatted = onlyNumber;
              } else if (onlyNumber.length < 8) {
                formatted = `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`;
              } else {
                formatted = `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3, 7)}-${onlyNumber.slice(7, 11)}`;
              }
              onChange("phone", formatted);
            }}
            placeholder="010-0000-0000"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
            disabled={isLoading}
          />
          {errors.phone && <p className="mt-1 text-[13px] text-red-500">{errors.phone}</p>}
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

        <div /> {/* 빈 공간 */}

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
