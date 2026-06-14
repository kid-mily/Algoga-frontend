"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import {
  createAdminManager,
  getAdminManagerById,
  updateAdminManager,
} from "@/features/services/adminManager.service";
import {
  emptyManagerForm,
  ManagerFormData,
  ManagerRequestPayload,
  managerRoleOptions,
} from "../types";

type ManagerFormClientProps = {
  mode: "create" | "edit";
  managerId?: number;
};

const toPayload = (
  formData: ManagerFormData
): ManagerRequestPayload => ({
  loginId: formData.loginId.trim(),
  ...(formData.password.trim() ? { password: formData.password.trim() } : {}),
  name: formData.name.trim(),
  phone: formData.phone.trim(),
  email: formData.email.trim(),
  role: formData.role,
});

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }

  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
};

export default function ManagerFormClient({
  mode,
  managerId,
}: ManagerFormClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ManagerFormData>(emptyManagerForm);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const fetchManager = useCallback(async (signal?: AbortSignal) => {
    if (mode !== "edit" || !managerId) return;

    try {
      setIsLoading(true);
      setError("");
      const manager = await getAdminManagerById(managerId, signal);

      if (signal?.aborted) return;

      if (!manager) {
        setError("관리자 계정을 찾을 수 없습니다.");
        return;
      }

      setFormData({
        loginId: manager.loginId,
        password: "",
        name: manager.name,
        phone: manager.phone,
        email: manager.email,
        role: manager.role,
      });
    } catch (fetchError: unknown) {
      if (signal?.aborted) return;

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "관리자 계정 정보를 불러오지 못했습니다."
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [managerId, mode]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void fetchManager(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchManager]);

  const updateField = <K extends keyof ManagerFormData>(
    key: K,
    value: ManagerFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!formData.loginId.trim()) {
      setError("로그인 ID를 입력해주세요.");
      return false;
    }

    if (mode === "create" && !formData.password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return false;
    }

    if (!formData.name.trim()) {
      setError("이름을 입력해주세요.");
      return false;
    }

    if (!formData.phone.trim()) {
      setError("전화번호를 입력해주세요.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("이메일을 입력해주세요.");
      return false;
    }

    const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setError("유효한 전화번호를 입력해주세요.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("유효한 이메일을 입력해주세요.");
      return false;
    }

    setError("");
    return true;
  };

  const saveManager = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const payload = toPayload(formData);

      if (mode === "edit" && managerId) {
        await updateAdminManager(managerId, payload);
      } else {
        await createAdminManager(payload);
      }

      setCompleteOpen(true);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "관리자 계정 저장에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (mode === "edit") {
      setConfirmOpen(true);
      return;
    }

    void saveManager().catch((saveError: unknown) => {
      console.error("saveManager failed:", saveError);
    });
  };

  if (isLoading) {
    return (
      <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        관리자 계정 정보를 불러오는 중입니다...
      </section>
    );
  }

  return (
    <main>
      <SubHeader
        backHref="/superadmin/manage"
        backText="관리자 계정 목록으로 돌아가기"
        title={mode === "create" ? "관리자 계정 생성" : "관리자 계정 수정"}
        description={
          mode === "create"
            ? "새 관리자 계정을 생성합니다."
            : "관리자 계정 정보를 수정합니다."
        }
      />

      <AdminErrorBanner message={error} className="mb-4" />

      <form
        onSubmit={handleSubmit}
        className="rounded-[16px] border border-[#E4E7EC] bg-white p-6"
      >
        <section className="mb-8" aria-labelledby="manager-login-title">
          <h2 id="manager-login-title" className="mb-6 text-[18px] font-bold text-[#111827]">
            로그인 정보
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <label className="block" htmlFor="manager-login-id">
              <span className="mb-3 block text-[14px] font-semibold text-[#344054]">
                로그인 ID <span className="text-red-500">*</span>
              </span>
              <input
                id="manager-login-id"
                value={formData.loginId}
                onChange={(event) => updateField("loginId", event.target.value)}
                className="h-[42px] w-full rounded-[10px] border border-[#D0D5DD] px-4 text-[14px] outline-none focus:border-[#639E9B]"
              />
            </label>

            <label className="block" htmlFor="manager-password">
              <span className="mb-3 block text-[14px] font-semibold text-[#344054]">
                비밀번호 {mode === "create" && <span className="text-red-500">*</span>}
              </span>
              <input
                id="manager-password"
                type="password"
                value={formData.password}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder={mode === "edit" ? "변경 시에만 입력" : "비밀번호 입력"}
                className="h-[42px] w-full rounded-[10px] border border-[#D0D5DD] px-4 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
              />
            </label>
          </div>
        </section>

        <section className="mb-8" aria-labelledby="manager-profile-title">
          <h2 id="manager-profile-title" className="mb-6 text-[18px] font-bold text-[#111827]">
            개인 정보
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <label className="block" htmlFor="manager-name">
              <span className="mb-3 block text-[14px] font-semibold text-[#344054]">
                이름 <span className="text-red-500">*</span>
              </span>
              <input
                id="manager-name"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="h-[42px] w-full rounded-[10px] border border-[#D0D5DD] px-4 text-[14px] outline-none focus:border-[#639E9B]"
              />
            </label>

            <label className="block" htmlFor="manager-phone">
              <span className="mb-3 block text-[14px] font-semibold text-[#344054]">
                전화번호 <span className="text-red-500">*</span>
              </span>
              <input
                id="manager-phone"
                value={formData.phone}
                onChange={(event) =>
                  updateField("phone", formatPhoneNumber(event.target.value))
                }
                placeholder="010-1234-5678"
                className="h-[42px] w-full rounded-[10px] border border-[#D0D5DD] px-4 text-[14px] outline-none focus:border-[#639E9B]"
              />
            </label>

            <label className="block" htmlFor="manager-email">
              <span className="mb-3 block text-[14px] font-semibold text-[#344054]">
                이메일 <span className="text-red-500">*</span>
              </span>
              <input
                id="manager-email"
                type="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="admin@algoga.com"
                className="h-[42px] w-full rounded-[10px] border border-[#D0D5DD] px-4 text-[14px] outline-none placeholder:text-[#98A2B3] focus:border-[#639E9B]"
              />
            </label>
          </div>
        </section>

        <fieldset>
          <legend className="mb-5 text-[18px] font-bold text-[#111827]">
            권한 선택 <span className="text-red-500">*</span>
          </legend>

          <div className="grid grid-cols-2 gap-3">
            {managerRoleOptions.map((role) => (
              <label
                key={role.value}
                className="flex h-[46px] cursor-pointer items-center gap-3 rounded-[10px] border border-[#D0D5DD] px-4 text-[14px] font-semibold text-[#111827]"
              >
                <input
                  type="radio"
                  name="manager-role"
                  checked={formData.role === role.value}
                  onChange={() => updateField("role", role.value)}
                  className="h-[16px] w-[16px] accent-[#639E9B]"
                />
                {role.label}
              </label>
            ))}
          </div>
        </fieldset>

        <footer className="mt-8 flex items-center justify-end gap-3 border-t border-[#E4E7EC] pt-6">
          <button
            type="button"
            onClick={() => router.push("/superadmin/manage")}
            className="h-[42px] px-5 text-[14px] font-semibold text-[#344054]"
          >
            취소
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[42px] rounded-[10px] bg-[#639E9B] px-5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            {isSubmitting
              ? "저장 중..."
              : mode === "create"
                ? "등록하기"
                : "수정 완료"}
          </button>
        </footer>
      </form>

      <Modal
        open={confirmOpen}
        title="관리자 수정"
        description="관리자 계정을 수정하시겠습니까?"
        confirmText="수정"
        cancelText="취소"
        onConfirm={() => {
          setConfirmOpen(false);
          void saveManager().catch((saveError: unknown) => {
            console.error("saveManager failed:", saveError);
          });
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      <CompleteModal
        open={completeOpen}
        title={mode === "create" ? "등록 완료" : "수정 완료"}
        description={
          mode === "create"
            ? "관리자 계정이 등록되었습니다."
            : "관리자 계정이 수정되었습니다."
        }
        buttonText="확인"
        onConfirm={() => router.push("/superadmin/manage")}
      />
    </main>
  );
}
