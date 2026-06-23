"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/features/services/auth.service";

type Props = {
  user: {
    nickname: string;
  } | null;
};

export default function Profile({ user }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      setIsOpen(false);

      window.dispatchEvent(new Event("auth-state-changed"));

      router.replace("/");
    }
  };

  return (
    <div className="flex gap-6 items-center pr-5">
      <Image
        src="/images/FriendIcon.svg"
        alt="친구"
        width={24}
        height={24}
        className="cursor-pointer"
      />

      <Image
        src="/images/ChatIcon.svg"
        alt="채팅"
        width={24}
        height={24}
        className="cursor-pointer"
      />

      <Image
        src="/images/NoticeIcon.svg"
        alt="알림"
        width={24}
        height={24}
        className="cursor-pointer"
      />

      {user ? (
        <div ref={menuRef} className="relative">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <Image
              src="/images/DefaultImg.svg"
              alt="기본 이미지"
              width={32}
              height={32}
              className="flex h-8 w-8 items-center justify-center"
            />

            <p className="mx-3">{user.nickname}님</p>
          </div>

          {isOpen && (
            <div className="absolute right-0 top-10 z-10 flex w-40 flex-col gap-3 rounded-lg border bg-white p-3 shadow-lg">
              <Link
                href="/mypage"
                className="cursor-pointer hover:text-[#286E6B]"
                onClick={() => setIsOpen(false)}
              >
                마이페이지
              </Link>

              <hr />

              <button
                type="button"
                className="cursor-pointer text-left hover:text-red-500"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/auth/login">
          <p className="cursor-pointer font-medium text-[#4A5568] hover:underline">
            로그인
          </p>
        </Link>
      )}
    </div>
  );
}