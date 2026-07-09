"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signup, socialSignup } from "@/features/services/signup.service";
import type { SocialType } from "@/features/auth/types";
import CompleteModal from "@/features/common/components/CompleteModal";
import RegisterAgreeForm from "./RegisterAgreeForm";
import RegisterCompleteForm from "./RegisterCompleteForm";
import RegisterHeader from "./RegisterHeader";
import RegisterInfoForm from "./RegisterInfoForm";
import RegisterStepHeader from "./RegisterStepHeader";
import { RegisterFormData, ServerError} from '../types'

// 소셜로그인 타입 지정
const getSocialType = (value: string | null): SocialType | null => {
  const normalizedValue = value?.toUpperCase();
  if (
    normalizedValue === "GOOGLE" ||
    normalizedValue === "KAKAO"
  ) {
    return normalizedValue;
  }

  return null;
};

export default function RegisterPageClient() {
  const searchParams = useSearchParams();
  const socialType = getSocialType(
    searchParams.get("socialType") ?? searchParams.get("provider")
  );
  const isSocialSignup = Boolean(socialType);

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", description: "" });
  const [serverError, setServerError] = useState<ServerError>({
    field: "",
    message: "",
  });
  const [formData, setFormData] = useState<RegisterFormData>({
    name: searchParams.get("name") ?? "",
    username: "",
    password: "",
    passwordConfirm: "",
    email: searchParams.get("email") ?? "",
    phone: "",
    birthDate: "",
    gender: "",
    nickname: "",
    socialType: socialType ?? "",
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
    setServerError({ field: "", message: "" });
    setStep(2);
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);

      if (!isSocialSignup && formData.password !== formData.passwordConfirm) {
        setModal({
          open: true,
          title: "오류",
          description: "비밀번호가 일치하지 않습니다.",
        });
        return;
      }

      if (isSocialSignup) {
        if (!socialType) {
          setModal({
            open: true,
            title: "오류",
            description: "소셜 로그인 정보가 올바르지 않습니다.",
          });
          return;
        }

        await socialSignup({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          birthDate: formData.birthDate,
          gender: formData.gender,
          nickname: formData.nickname,
          socialType,
          referralCode: formData.referralCode || undefined,
          signupPath: formData.signupPath || undefined,
          termsServiceAgreed: formData.termsServiceAgreed,
          termsPrivacyAgreed: formData.termsPrivacyAgreed,
          termsMarketingAgreed: formData.termsMarketingAgreed,
        });
      } else {
        await signup(formData);
      }

      setStep(3);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "서버 오류가 발생했습니다.";

      if (errorMessage.includes("아이디")) {
        setServerError({ field: "username", message: errorMessage });
        setStep(1);
        return;
      }

      if (
        errorMessage.includes("이메일") ||
        errorMessage.includes("사용") ||
        errorMessage.includes("중복") ||
        errorMessage.includes("존재")
      ) {
        setServerError({ field: "email", message: errorMessage });
        setStep(1);
        return;
      }

      setModal({
        open: true,
        title: "회원가입 실패",
        description: errorMessage,
      });
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
              isSocialSignup={isSocialSignup}
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
              {isLoading && (
                <p className="mt-4 text-center text-[#439A97] text-[15px] font-semibold">
                  회원가입 처리 중입니다...
                </p>
              )}
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
