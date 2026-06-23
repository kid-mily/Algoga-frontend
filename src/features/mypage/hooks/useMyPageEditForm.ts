"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { MyPageEditFormProps } from "../types";
import { submitMyPageEdit } from "../action";

export function useMyPageEditForm({
  user,
  initial,
}: MyPageEditFormProps) {
  const router = useRouter();

  const [nickname, setNickname] = useState(
    user.nickname || user.name || ""
  );
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [profileImage, setProfileImage] =
    useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(
    user.profileImageUrl || ""
  );

  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayInitial = useMemo(
    () => nickname.trim().slice(0, 1) || initial,
    [nickname, initial]
  );

  const genderText = useMemo(() => {
    if (user.gender === "MALE") return "남성";
    if (user.gender === "FEMALE") return "여성";
    return user.gender || "";
  }, [user.gender]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

    const values = {
      nickname: nickname.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    if (!values.nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (!values.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!values.phone) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    if (
      Boolean(currentPassword) !== Boolean(newPassword)
    ) {
      alert(
        "현재 비밀번호와 새 비밀번호를 모두 입력해주세요."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await submitMyPageEdit({
        ...values,
        profileImage,
        currentPassword,
        newPassword,
      });

      // HttpOnly 쿠키는 백엔드 Set-Cookie로 갱신됩니다.
      window.dispatchEvent(
        new Event("auth-state-changed")
      );

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

  return {
    nickname,
    setNickname,
    email,
    setEmail,
    phone,
    setPhone,
    previewUrl,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    isSubmitting,
    displayInitial,
    genderText,
    handleProfileImageChange,
    handleSubmit,
    goBack: () => router.back(),
    cancel: () => router.push("/mypage"),
  };
}