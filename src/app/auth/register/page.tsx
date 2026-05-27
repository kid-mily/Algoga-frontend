"use client";

import { useState } from "react";

import RegisterHeader from "@/features/auth/components/registerheader";
import RegisterStepHeader from "@/features/auth/components/registerstepheader";
import RegisterInfoForm from "@/features/auth/components/registeinforform";
import RegisterAgreeForm from "@/features/auth/components/registeragreeform";
import RegisterCompleteForm from "@/features/auth/components/registercompleteform";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  // 전체 폼 상태 통합 관리
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    passwordConfirm: "", // 프론트엔드 유효성 검사용
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    nickname: "", // DTO에 존재하나 기존 UI에 누락되어 추가됨
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
                onNext={() => setStep(3)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="rounded-[32px] bg-white p-10">
              {/* API 제출 로직은 이 컴포넌트 내부 혹은 여기서 처리 */}
              <RegisterCompleteForm formData={formData} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}