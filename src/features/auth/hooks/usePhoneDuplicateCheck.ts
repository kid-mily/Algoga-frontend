import { useRef, useState } from "react";
import { checkPhoneDuplicate } from "@/features/services/signup.service";

const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;

export const usePhoneDuplicateCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState("");
  const controllerRef = useRef<AbortController | null>(null);

  const reset = () => {
    controllerRef.current?.abort();
    setIsChecking(false);
    setIsChecked(false);
    setMessage("");
  };

  const check = async (phone: string, onError: (message: string) => void) => {
    const trimmedPhone = phone.trim();

    if (!phoneRegex.test(trimmedPhone)) {
      onError("올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)");
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setIsChecking(true);
      setMessage("");
      onError("");

      const isAvailable = await checkPhoneDuplicate(
        trimmedPhone,
        controller.signal
      );

      if (controller.signal.aborted) return;

      if (!isAvailable) {
        setIsChecked(false);
        setMessage("");
        onError("이미 사용 중인 전화번호입니다.");
        return;
      }

      setIsChecked(true);
      setMessage("사용 가능한 전화번호입니다.");
    } catch (error: unknown) {
      if (isAbortError(error) || controller.signal.aborted) return;

      const errorMessage =
        error instanceof Error ? error.message : "전화번호 중복 확인에 실패했습니다.";

      setIsChecked(false);
      setMessage("");
      onError(errorMessage);
    } finally {
      if (!controller.signal.aborted) {
        setIsChecking(false);
      }
    }
  };

  return { isChecking, isChecked, message, check, reset };
};
