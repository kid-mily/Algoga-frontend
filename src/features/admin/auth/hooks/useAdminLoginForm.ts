"use client";

import { useState } from "react";
import { markAdminSessionActive, saveAdminDisplayInfo } from "@/features/admin/auth/services/adminSession";
import { adminLogin, getAdminLoginRole, getAdminRedirectPathByRole } from "@/features/services/adminAuth.service";

const ADMIN_PATH_PREFIXES = [
  "/contentadmin",
  "/csadmin",
  "/moneyadmin",
  "/statisticadmin",
  "/superadmin",
];

const getSafeNextPath = () => {
  const rawNext = new URLSearchParams(window.location.search).get("next");
  if (!rawNext) return null;

  try {
    const nextUrl = new URL(rawNext, window.location.origin);
    const isInternal = nextUrl.origin === window.location.origin;
    const isAdminPath = ADMIN_PATH_PREFIXES.some(
      (path) =>
        nextUrl.pathname === path || nextUrl.pathname.startsWith(`${path}/`)
    );

    if (!isInternal || !isAdminPath) return null;

    return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
  } catch {
    return null;
  }
};

export const useAdminLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loginIdError, setLoginIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginIdChange = (value: string) => {
    setLoginId(value);

    if (loginIdError) {
      setLoginIdError("");
    }

    if (serverError) {
      setServerError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (passwordError) {
      setPasswordError("");
    }

    if (serverError) {
      setServerError("");
    }
  };

  const handleLogin = async () => {
    const trimmedLoginId = loginId.trim();
    let hasError = false;

    setServerError("");

    if (!trimmedLoginId) {
      setLoginIdError("관리자 아이디를 입력해주세요.");
      hasError = true;
    } else {
      setLoginIdError("");
    }

    if (!password.trim()) {
      setPasswordError("비밀번호를 입력해주세요.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    try {
      setIsLoading(true);

      const admin = await adminLogin({
        loginId: trimmedLoginId,
        password,
      });
      const role = getAdminLoginRole(admin);

      if (!role) {
        throw new Error("관리자 역할 정보를 받지 못했습니다.");
      }

      markAdminSessionActive(role);
      saveAdminDisplayInfo(admin, role, trimmedLoginId);
      window.location.replace(
        getSafeNextPath() ?? getAdminRedirectPathByRole(role)
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "관리자 로그인에 실패했습니다.";

      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    loginId,
    password,
    loginIdError,
    passwordError,
    serverError,
    isLoading,
    handleLoginIdChange,
    handlePasswordChange,
    handleLogin,
  };
};

