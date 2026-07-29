import { useRef, useState } from "react";
import { sendSignupEmailCode, verifySignupEmailCode } from "@/features/services/signup.service";
import { emailRegex } from "../utils/registerValidators";
import { getErrorCode } from "../utils/authError";

const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

export const useEmailVerification = () => {
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const controllerRef = useRef<AbortController | null>(null);

  const reset = () => {
    controllerRef.current?.abort();
    setIsSending(false);
    setIsCodeSent(false);
    setIsVerified(false);
    setIsDuplicated(false);
    setCode("");
    setMessage("");
  };

  const sendCode = async (email: string, onError: (message: string) => void) => {
    const trimmedEmail = email.trim();

    if (!emailRegex.test(trimmedEmail)) {
      onError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setIsSending(true);
      setIsDuplicated(false);
      setIsVerified(false);
      setCode("");
      setMessage("");
      onError("");

      await sendSignupEmailCode(trimmedEmail, controller.signal);

      if (controller.signal.aborted) return;

      setIsCodeSent(true);
      setMessage("인증번호를 이메일로 보냈습니다.");
    } catch (error: unknown) {
      if (isAbortError(error) || controller.signal.aborted) return;

      const errorMessage =
        error instanceof Error ? error.message : "이메일 인증번호 발송에 실패했습니다.";
      const errorCode = getErrorCode(error);
      const duplicated =
        errorCode === "AUTH_001" ||
        (!errorCode && /이미.*(가입|사용)|중복.*이메일/.test(errorMessage));

      setIsCodeSent(false);
      setIsVerified(false);
      setIsDuplicated(duplicated);
      setMessage("");
      onError(errorMessage);
    } finally {
      if (!controller.signal.aborted) {
        setIsSending(false);
      }
    }
  };

  const verifyCode = async (email: string, onError: (message: string) => void) => {
    if (!code.trim()) {
      setMessage("");
      onError("인증번호를 입력해주세요.");
      return;
    }

    try {
      setIsVerifying(true);
      onError("");

      await verifySignupEmailCode(email.trim(), code.trim());
      setIsVerified(true);
      setMessage("이메일 인증이 완료되었습니다.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "인증번호 확인에 실패했습니다.";

      setIsVerified(false);
      setMessage("");
      onError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isSending,
    isVerifying,
    isCodeSent,
    isVerified,
    isDuplicated,
    code,
    setCode,
    message,
    sendCode,
    verifyCode,
    reset,
  };
};
