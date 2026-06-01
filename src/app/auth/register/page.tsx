"use client";

import { useState } from "react";
import { signup } from "@/features/services/signup.service"; 

import RegisterHeader from "@/features/auth/components/RegisterHeader";
import RegisterStepHeader from "@/features/auth/components/RegisterStepHeader";
import RegisterInfoForm from "@/features/auth/components/RegisterInfoForm";
import RegisterAgreeForm from "@/features/auth/components/RegisterAgreeForm";
import RegisterCompleteForm from "@/features/auth/components/RegisterCompleteForm";
import CompleteModal from "@/features/common/CompleteModal";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", description: "" });
  
  //  객체 형태로 변경: 어디서 에러가 났는지(field)와 에러 메시지를 함께 저장
  const [serverError, setServerError] = useState({ field: "", message: "" });

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    nickname: "", 
    referralCode: "",
    signupPath: "",
    termsServiceAgreed: false,
    termsPrivacyAgreed: false,
    termsMarketingAgreed: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep1 = () => {
    setServerError({ field: "", message: "" }); // Step 2로 갈 때 에러 초기화
    setStep(2);
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      if (formData.password !== formData.passwordConfirm) {
        setModal({ open: true, title: "오류", description: "비밀번호가 일치하지 않습니다." });
        return;
      }

      // 백엔드 회원가입 통신
      await signup(formData);
      setStep(3); // 성공 시 Step 3으로 넘어감

    } catch (error: any) {
      const errMsg = error.message || "서버 오류가 발생했습니다.";
      
      // 🌟 [핵심] 에러 내용에 따라 어떤 필드의 에러인지 구분
      if (errMsg.includes("아이디")) {
        // 에러 메시지에 '아이디'가 포함된 경우
        setServerError({ field: "username", message: errMsg });
        setStep(1); 
      } else if (errMsg.includes("이메일") || errMsg.includes("사용") || errMsg.includes("중복") || errMsg.includes("존재")) {
        // 그 외 이메일 중복 관련 에러인 경우
        setServerError({ field: "email", message: errMsg });
        setStep(1); 
      } else {
        // 중복 문제가 아닌 다른 서버 에러는 공통 모달로 띄움
        setModal({ open: true, title: "회원가입 실패", description: errMsg });
      }
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
              onNext={handleNextStep1}
              isLoading={isLoading}
              serverError={serverError}       
              setServerError={setServerError} 
            />
          )}

          {step === 2 && (
            <div className="rounded-[32px] bg-white p-10">
              <RegisterAgreeForm
                formData={formData}
                onChange={handleChange}
                onPrev={() => setStep(1)}
                onNext={handleSignup} 
              />
              {isLoading && <p className="text-center mt-4 text-[#439A97] font-semibold">회원가입 처리 중입니다...</p>}
            </div>
          )}

          {step === 3 && (
            <div className="rounded-[32px] bg-white p-10">
              <RegisterCompleteForm formData={formData} />
            </div>
          )}
        </section>
      </div>

      <CompleteModal
        open={modal.open}
        title={modal.title}
        description={modal.description}
        buttonText="확인"
        onConfirm={() => setModal({ open: false, title: "", description: "" })}
      />
    </main>
  );
}