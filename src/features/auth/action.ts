'use server';

import { redirect } from "next/navigation";
import { login } from "../services/auth.service";

type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export const loginAction = async (
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    // 백엔드가 Set-Cookie(HttpOnly)로 인증 쿠키를 내려줍니다.
    await login({ username, password });
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }

  redirect("/");
};
