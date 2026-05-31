"use client";

import { useState } from "react";

interface RegisterInfoFormProps {
  formData: any;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  isLoading?: boolean;
  serverEmailError?: string; 
  setServerEmailError?: (msg: string) => void; 
}

export default function RegisterInfoForm({ 
  formData, 
  onChange, 
  onNext, 
  isLoading, 
  serverEmailError, 
  setServerEmailError 
}: RegisterInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEtcRoute, setIsEtcRoute] = useState(formData.signupPath !== "" && !["search", "social", "friend", "ad"].includes(formData.signupPath));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "이름은 필수입니다.";

    if (!formData.username || formData.username.length < 4 || formData.username.length > 20) {
      newErrors.username = "아이디는 4자 이상 20자 이하로 입력해주세요.";
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!formData.password || !passwordRegex.test(formData.password)) {
      newErrors.password = "비밀번호는 영문, 숫자 조합 8자 이상이어야 합니다.";
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
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

  return (
    <div className="mt-3 w-full rounded-[35px] bg-white p-8 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      <h2 className="text-[25px] font-bold text-[#111827]">기본 정보 입력</h2>

      <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4">
        {/* 이름 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">성명 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="홍길동"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-[13px] text-red-500">{errors.name}</p>}
        </div>

        {/* 아이디 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">아이디 *</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => onChange("username", e.target.value)}
            placeholder="4자 이상 20자 이하"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
            disabled={isLoading}
          />
          {errors.username && <p className="mt-1 text-[13px] text-red-500">{errors.username}</p>}
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">비밀번호 *</label>
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

        {/* 비밀번호 확인 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">비밀번호 확인 *</label>
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

        {/* 닉네임 */}
        <div className="col-span-2">
          <label className="text-[16px] font-semibold text-[#111827]">닉네임 *</label>
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

        {/* 🌟 이메일: 프론트엔드 검사 에러와 서버 중복 에러를 모두 처리 */}
        <div className="col-span-2">
          <label className="text-[16px] font-semibold text-[#111827]">이메일 *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              onChange("email", e.target.value);
              // 사용자가 이메일을 수정하면 서버 에러 메시지 초기화
              if (setServerEmailError) setServerEmailError(""); 
            }}
            placeholder="example@algoga.com"
            className={`mt-3 h-[35px] w-full rounded-[16px] border bg-[#F9FAFB] px-5 text-[15px] outline-none ${
              errors.email || serverEmailError ? "border-red-500" : "border-[#D0D5DD]"
            }`}
            disabled={isLoading}
          />
          {/* 1순위: 형식 틀림 에러 */}
          {errors.email && <p className="mt-1 text-[13px] text-red-500">{errors.email}</p>}
          
          {/* 2순위: 서버 중복 에러 (형식이 맞을 때만 띄움) */}
          {serverEmailError && !errors.email && (
            <p className="mt-1 text-[13px] text-red-500">{serverEmailError}</p>
          )}
        </div>

        {/* 전화번호 */}
        <div className="col-span-2">
          <label className="text-[16px] font-semibold text-[#111827]">전화번호 *</label>
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
          <label className="text-[16px] font-semibold text-[#111827]">생년월일 *</label>
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
          <label className="text-[16px] font-semibold text-[#111827]">성별 *</label>
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
        className={`mt-8 h-[43px] w-full rounded-[18px] text-[18px] font-semibold text-white transition ${
          isLoading ? "bg-[#D0D5DD] cursor-not-allowed" : "bg-[#439A97] hover:bg-[#357c7a]"
        }`}
      >
        {isLoading ? "확인 중..." : "다음"}
      </button>
    </div>
  );
}