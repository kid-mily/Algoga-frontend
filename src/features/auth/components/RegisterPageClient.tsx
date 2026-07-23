"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signup, socialSignup } from "@/features/services/signup.service";
import type { SocialType } from "@/features/auth/types";
import { getErrorCode } from "@/features/auth/utils/authError";
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
      const errorCode = getErrorCode(error);
      const errorMessage =
        error instanceof Error ? error.message : "서버 오류가 발생했습니다.";

      // 회원가입 실패 시 에러 코드를 우선으로 보고, 문제가 된 필드만 초기화한다.
      // 이메일 인증 완료 / 아이디 중복확인 통과 플래그는 서버(Redis)에 30분간 유지되므로
      // 다른 필드 문제로 실패했을 때 굳이 재인증·재확인시키지 않는다.

      // 아이디 중복(AUTH_002): 아이디 입력값만 초기화, 이메일 인증·전화 확인 등은 유지.
      if (errorCode === "AUTH_002" || (!errorCode && errorMessage.includes("아이디"))) {
        setFormData((prev) => ({ ...prev, username: "" }));
        setServerError({ field: "username", message: errorMessage });
        setStep(1);
        return;
      }

      // 전화번호 중복(USER_005): 전화번호 입력값만 초기화, 나머지 값·인증 상태는 유지.
      // (USER_005 메시지에 "사용"이 들어 있어 이메일 분기보다 앞서 라우팅한다.)
      if (errorCode === "USER_005" || (!errorCode && errorMessage.includes("전화"))) {
        setFormData((prev) => ({ ...prev, phone: "" }));
        setServerError({ field: "phone", message: errorMessage });
        setStep(1);
        return;
      }

      // 이메일 미인증/인증 만료(AUTH_014): 30분 경과 등으로 서버 인증 상태가 사라진 경우.
      // 이메일 주소와 나머지 입력값은 그대로 두고, 이메일 인증 단계만 다시 요구한다.
      if (errorCode === "AUTH_014") {
        setServerError({
          field: "email",
          message: "이메일 인증이 만료되었어요. 이메일 인증을 다시 진행해주세요.",
        });
        setStep(1);
        return;
      }

      // 이메일 중복(AUTH_001) / 탈퇴 후 재가입 제한(AUTH_019):
      // 서버 안내 문구를 이메일 필드에 그대로 표시한다.
      if (
        errorCode === "AUTH_001" ||
        errorCode === "AUTH_019" ||
        (!errorCode &&
          (errorMessage.includes("이메일") ||
            errorMessage.includes("사용") ||
            errorMessage.includes("중복") ||
            errorMessage.includes("존재")))
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
          {/*
            step 1 ↔ 2 를 오갈 때 RegisterInfoForm 을 언마운트하지 않고 감추기만 한다.
            언마운트하면 이메일 인증 완료 / 아이디·전화 중복확인 상태가 사라져,
            제출 실패로 step 1 로 되돌아왔을 때 다시 인증해야 하는 문제가 생긴다.
          */}
          {step !== 3 && (
            <div className={step === 1 ? "" : "hidden"} aria-hidden={step !== 1}>
              <RegisterInfoForm
                formData={formData}
                onChange={handleChange}
                onNext={handleNextStep1}
                isLoading={isLoading}
                serverError={serverError}
                setServerError={setServerError}
                isSocialSignup={isSocialSignup}
              />
            </div>
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
