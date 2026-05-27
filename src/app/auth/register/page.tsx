"use client";

import { useState } from "react";
import { authApi } from "@/lib/auth"; // 위에서 만든 API 모듈 임포트

import RegisterHeader from "@/features/auth/components/registerheader";
import RegisterStepHeader from "@/features/auth/components/registerstepheader";
import RegisterInfoForm from "@/features/auth/components/registeinforform";
import RegisterAgreeForm from "@/features/auth/components/registeragreeform";
import RegisterCompleteForm from "@/features/auth/components/registercompleteform";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // 전체 폼 상태 통합 관리
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    passwordConfirm: "", // 프론트엔드 유효성 검사용
    email: "",
    phone: "", // 형식: 010-1234-5678
    birthDate: "", // 형식: YYYY-MM-DD
    gender: "", // MALE, FEMALE, OTHER (백엔드 Enum 포맷 준수)
    nickname: "", 
    referralCode: "",
    signupPath: "",
    termsServiceAgreed: false,
    termsPrivacyAgreed: false,
    termsMarketingAgreed: false,
  });

  // 상태 업데이트 함수
  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🌟 실제 회원가입 API 호출 로직
  const handleSignup = async () => {
    try {
      setIsLoading(true);
      // 비밀번호 일치 검사
      if (formData.password !== formData.passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      // 백엔드 요청
      await authApi.signup(formData);
      // 가입 성공 시 완료 화면(Step 3)으로 이동
      setStep(3);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-10 py-8">
      <div className="mx-auto flex w-full max-w-[720px] flex-col">
        <RegisterHeader />
        <RegisterStepHeader currentStep={step} />

        <section className="mt-3">
          {step === 1 && (
            <RegisterInfoForm
              formData={formData}
              onChange={handleChange}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <div className="rounded-[32px] bg-white p-10">
              <RegisterAgreeForm
                formData={formData}
                onChange={handleChange}
                onPrev={() => setStep(1)}
                onNext={handleSignup} // 🌟 기존 단순 setStep(3) 대신 API 호출 함수 연결
              />
              {isLoading && <p className="text-center mt-4 text-gray-500">회원가입 처리 중...</p>}
            </div>
          )}

          {step === 3 && (
            <div className="rounded-[32px] bg-white p-10">
              <RegisterCompleteForm formData={formData} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}