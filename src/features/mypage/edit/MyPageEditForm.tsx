"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { setCookie } from "@/lib/cookie";
import {
  changeMyPassword,
  updateMyProfile,
} from "@/features/services/mypage.service";
import type { MyPageUser } from "@/features/mypage/types";

interface MyPageEditFormProps {
  user: MyPageUser;
  initial: string;
}

export default function MyPageEditForm({ user, initial }: MyPageEditFormProps) {
  const router = useRouter();

  const [nickname, setNickname] = useState(user.nickname || user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user.profileImageUrl || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayInitial = useMemo(() => {
    return nickname.trim().slice(0, 1) || initial;
  }, [nickname, initial]);

  const genderText = useMemo(() => {
    if (user.gender === "MALE") return "남성";
    if (user.gender === "FEMALE") return "여성";
    return user.gender || "";
  }, [user.gender]);

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNickname = nickname.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedNickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (!trimmedEmail) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!trimmedPhone) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      alert("비밀번호를 변경하려면 현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      console.log("정보 수정 저장 클릭:", {
        nickname: trimmedNickname,
        email: trimmedEmail,
        phone: trimmedPhone,
        hasProfileImage: Boolean(profileImage),
        profileImage,
      });

      const profileResult = await updateMyProfile({
        nickname: trimmedNickname,
        email: trimmedEmail,
        phone: trimmedPhone,
        profileImage,
      });

      console.log("프로필 수정 성공 응답:", profileResult);

      if (profileResult?.accessToken) {
        setCookie("accessToken", profileResult.accessToken);
      }

      if (profileResult?.refreshToken) {
        setCookie("refreshToken", profileResult.refreshToken);
      }

      window.dispatchEvent(new Event("auth-state-changed"));

      if (currentPassword && newPassword) {
        await changeMyPassword({
          currentPassword,
          newPassword,
        });
      }

      alert("회원 정보가 수정되었습니다.");
      router.push("/mypage");
      router.refresh();
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
      alert(
        error instanceof Error
          ? error.message
          : "회원 정보 수정 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xl font-bold text-slate-900"
        >
          <span aria-hidden="true">‹</span>
          정보 수정
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#5f9c98] px-6 text-sm font-bold text-white transition hover:bg-[#528d89] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span aria-hidden="true">□</span>
          {isSubmitting ? "저장 중" : "저장"}
        </button>
      </div>

      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="bg-[#eef5ff] px-8 py-8">
          <h2 className="mb-5 text-base font-bold text-slate-900">
            프로필 사진
          </h2>

          <div className="flex items-center gap-6">
            <label className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-[#5f9c98] text-4xl font-bold text-white">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="프로필 이미지"
                  className="h-full w-full object-cover"
                />
              ) : (
                displayInitial
              )}

              <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-[#5f9c98]">
                사진
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </label>

            <div>
              <p className="text-sm font-bold text-slate-900">
                프로필 사진 변경
              </p>
              <p className="mt-2 text-xs text-slate-500">
                JPG, PNG 파일을 업로드할 수 있어요.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-8 py-8 md:grid-cols-2">
          <Field label="성명" value={user.name || ""} disabled />

          <Field label="사용자 코드" value={user.personalCode || ""} disabled />

          <Field label="아이디" value={user.username || ""} disabled />

          <Field label="성별" value={genderText} disabled />

          <Field label="생년월일" value={user.birthDate || ""} disabled />

          <Field
            label="닉네임"
            value={nickname}
            onChange={setNickname}
            placeholder="닉네임을 입력해주세요"
          />

          <Field
            label="이메일"
            value={email}
            onChange={setEmail}
            placeholder="이메일을 입력해주세요"
          />

          <Field
            label="전화번호"
            value={phone}
            onChange={setPhone}
            placeholder="전화번호를 입력해주세요"
          />

          <PasswordField
            label="현재 비밀번호"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="현재 비밀번호"
            visible={showCurrentPassword}
            onToggle={() => setShowCurrentPassword((prev) => !prev)}
          />

          <PasswordField
            label="새 비밀번호"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="새 비밀번호"
            visible={showNewPassword}
            onToggle={() => setShowNewPassword((prev) => !prev)}
          />
        </div>
      </section>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => router.push("/mypage")}
          className="h-12 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition hover:bg-slate-50"
        >
          취소
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 rounded-2xl bg-[#5f9c98] text-sm font-bold text-white transition hover:bg-[#528d89] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "저장 중" : "저장하기"}
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

function Field({ label, value, placeholder, disabled, onChange }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-900">
        {label}
      </span>

      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#5f9c98] disabled:bg-slate-50 disabled:text-slate-400"
      />
    </label>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  placeholder: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

function PasswordField({
  label,
  value,
  placeholder,
  visible,
  onChange,
  onToggle,
}: PasswordFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-900">
        {label}
      </span>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#5f9c98]"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400"
        >
          {visible ? "숨김" : "보기"}
        </button>
      </div>
    </label>
  );
}