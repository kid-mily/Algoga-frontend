"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { changeMyPassword, updateMyProfile } from "@/features/services/mypage.service";
import type { MyPageUser } from "@/features/mypage/types";

interface MyPageEditFormProps {
  user: MyPageUser;
  initial: string;
}

export default function MyPageEditForm({
  user,
  initial,
}: MyPageEditFormProps) {
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

  const displayInitial = useMemo(
    () => nickname.trim().slice(0, 1) || initial,
    [nickname, initial]
  );

  const genderText = useMemo(() => {
    if (user.gender === "MALE") return "남성";
    if (user.gender === "FEMAL" || user.gender === "FEMALE") return "여성";
    if (user.gender === "OTHER") return "기타";

    return user.gender || "-";
  }, [user.gender]);

  const handleProfileImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
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

    if (Boolean(currentPassword) !== Boolean(newPassword)) {
      alert("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateMyProfile({
        nickname: trimmedNickname,
        email: trimmedEmail,
        phone: trimmedPhone,
        profileImage,
      });

      if (currentPassword && newPassword) {
        await changeMyPassword({
          currentPassword,
          newPassword,
        });
      }

      window.dispatchEvent(new Event("auth-state-changed"));

      alert("회원 정보가 수정되었습니다.");
      router.push("/mypage");
      router.refresh();
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);

      alert(
        error instanceof Error
          ? error.message
          : "회원 정보 수정 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full w-full flex-col">
      <div className="mb-4 flex items-center justify-between">
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
          className="inline-flex h-10 items-center rounded-xl bg-[#5f9c98] px-6 text-sm font-bold text-white transition hover:bg-[#528d89] disabled:opacity-60"
        >
          {isSubmitting ? "저장 중" : "저장"}
        </button>
      </div>

      <section className="flex-1 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="bg-[#eef5ff] px-6 py-5">
          <h2 className="mb-4 text-sm font-bold text-slate-900">
            프로필 사진
          </h2>

          <div className="flex items-center gap-5">
            <label className="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-[#5f9c98] text-3xl font-bold text-white">
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

              <span className="absolute bottom-1.5 right-1.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-[#5f9c98]">
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
              <p className="mt-1 text-xs text-slate-500">
                JPG, PNG 파일을 업로드할 수 있어요.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-3">
          <Field
            label="성명"
            value={user.name || ""}
            disabled
          />

          <Field
            label="사용자 코드"
            value={user.personalCode || ""}
            disabled
          />

          <Field
            label="아이디"
            value={user.username || ""}
            disabled
          />

          <Field
            label="성별"
            value={genderText}
            disabled
          />

          <Field
            label="생년월일"
            value={user.birthDate || ""}
            disabled
          />

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
            onToggle={() =>
              setShowCurrentPassword((prev) => !prev)
            }
          />

          <PasswordField
            label="새 비밀번호"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="새 비밀번호"
            visible={showNewPassword}
            onToggle={() =>
              setShowNewPassword((prev) => !prev)
            }
          />
        </div>
      </section>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => router.push("/mypage")}
          className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600"
        >
          취소
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-xl bg-[#5f9c98] text-sm font-bold text-white disabled:opacity-60"
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

function Field({
  label,
  value,
  placeholder,
  disabled,
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-900">
        {label}
      </span>

      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#5f9c98] disabled:bg-slate-50 disabled:text-slate-400"
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
      <span className="mb-1.5 block text-xs font-bold text-slate-900">
        {label}
      </span>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-10 w-full rounded-xl border border-slate-200 px-3 pr-14 text-sm outline-none focus:border-[#5f9c98]"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400"
        >
          {visible ? "숨김" : "보기"}
        </button>
      </div>
    </label>
  );
}