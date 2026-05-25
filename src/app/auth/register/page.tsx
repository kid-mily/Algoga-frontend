"use client";

import { useState } from "react";

import RegisterHeader from "@/features/auth/components/registerheader";
import RegisterStepHeader from "@/features/auth/components/registerstepheader";
import RegisterInfoForm from "@/features/auth/components/registeinforform";
import RegisterAgreeForm from "@/features/auth/components/registeragreeform";
import RegisterCompleteForm from "@/features/auth/components/registercompleteform";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  return (
   <main className="min-h-screen bg-[#F8F8F8] px-10 py-8">
  {/* 전체 wrapper */}
  <div className="mx-auto flex w-full max-w-[720px] flex-col">
    
    
    {/* 헤더 */}
    <RegisterHeader />

    {/* step */}
    <RegisterStepHeader currentStep={step} />

    {/* form */}
    <section className="mt-3">
      {step === 1 && (
        // 기본정보등록페이지
        <RegisterInfoForm
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <div className="rounded-[32px] bg-white p-10">
          {/* 약관 동의 페이지 */}
          <RegisterAgreeForm
              onPrev={() => setStep(1)}
              onNext={() => setStep(3)}
          />
        </div>
      )}

      {step === 3 && (
        <div className="rounded-[32px] bg-white p-10">
          {/* 가입 완료 페이지 */}
          <RegisterCompleteForm 
          />

        </div>
      )}
    </section>
  </div>
</main>
  );
}