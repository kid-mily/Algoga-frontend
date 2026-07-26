import { useRef, useState } from "react";
import { checkUsernameDuplicate } from "@/features/services/signup.service";
import {
  REGISTER_REQUIRED_USERNAME_MESSAGE,
  validateRegisterUsername,
} from "@/features/auth/utils/registerValidators";

const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

export const useUsernameDuplicateCheck = () => {
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

  const check = async (username: string, onError: (message: string) => void) => {
    const trimmedUsername = username.trim();

    if (validateRegisterUsername(trimmedUsername)) {
      onError(REGISTER_REQUIRED_USERNAME_MESSAGE);
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setIsChecking(true);
      setMessage("");
      onError("");

      const isAvailable = await checkUsernameDuplicate(
        trimmedUsername,
        controller.signal
      );

      if (controller.signal.aborted) return;

      if (!isAvailable) {
        setIsChecked(false);
        setMessage("");
        onError("이미 사용 중인 아이디입니다.");
        return;
      }

      setIsChecked(true);
      setMessage("사용 가능한 아이디입니다.");
    } catch (error: unknown) {
      if (isAbortError(error) || controller.signal.aborted) return;

      const errorMessage =
        error instanceof Error ? error.message : "아이디 중복 확인에 실패했습니다.";

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
