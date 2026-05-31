"use client";

import { useState } from "react";
import { authApi } from "@/lib/auth"; // 실제 사용하는 API 모듈에 맞게 경로 수정

import RegisterHeader from "@/features/auth/components/RegisterHeader";
import RegisterStepHeader from "@/features/auth/components/RegisterStepHeader";
import RegisterInfoForm from "@/features/auth/components/RegisterInfoForm";
import RegisterAgreeForm from "@/features/auth/components/RegisterAgreeForm";
import RegisterCompleteForm from "@/features/auth/components/RegisterCompleteForm";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", description: "" });
  
  // 🌟 Step 1 이메일 인풋창 밑에 보여줄 에러 텍스트 상태
  const [serverEmailError, setServerEmailError] = useState("");

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

  // 🌟 [핵심] Step 1에서 '다음' 버튼 누를 때 실행 (여기서 막습니다!)
  const handleNextStep1 = async () => {
    try {
      setIsLoading(true);
      setServerEmailError(""); // 기존 에러 초기화

      /* 💡 백엔드에 이메일 중복 확인 API가 있다면 여기서 호출하세요.
        만약 API 응답이 "중복"이거나 500/409 에러가 발생하면 
        setServerEmailError()에 메시지를 넣고 return; 하여 막습니다.
      */
      
      // 예시: 백엔드 이메일 중복 확인 (구현된 api 코드에 맞게 주석 해제하여 사용)
      /*
      const isDuplicate = await authApi.checkEmail(formData.email);
      if (isDuplicate) {
        setServerEmailError("이미 사용 중인 이메일입니다.");
        return; // 🌟 에러가 있으면 Step 2로 절대 넘어가지 않고 여기서 함수 종료!
      }
      */

      // API 통과 시에만 Step 2로 이동
      setStep(2);
    } catch (error: any) {
      // API 통신 실패 시에도 넘어가지 않고 빨간 글씨 띄움
      setServerEmailError(error.message || "이메일 중복 확인 중 서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      if (formData.password !== formData.passwordConfirm) {
        setModal({ open: true, title: "오류", description: "비밀번호가 일치하지 않습니다." });
        return;
      }

      // 최종 회원가입 통신
      await authApi.signup(formData); // 실제 구현된 회원가입 함수 사용
      setStep(3); // 성공 시 Step 3으로 넘어감

    } catch (error: any) {
      setModal({ open: true, title: "회원가입 실패", description: error.message || "서버 오류가 발생했습니다." });
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
              onNext={handleNextStep1} // 🌟 단순 이동이 아닌 중복검사 로직 연결
              isLoading={isLoading}
              serverEmailError={serverEmailError}       
              setServerEmailError={setServerEmailError} 
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
    </main>
  );
}