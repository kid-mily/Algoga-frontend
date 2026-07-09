"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/features/services/auth.service";
import { deleteCookie } from "@/lib/cookie";

type Props = {
  user: {
    nickname: string;
    profileImageUrl?: string | null;
  } | null;
};

const clearUserAuthClientState = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  deleteCookie("Authorization");
};

const getProfileImageSrc = (profileImageUrl?: string | null) => {
  if (!profileImageUrl || profileImageUrl === "null") return "/images/DefaultImg.svg";

  return profileImageUrl;
};

export default function Profile({ user }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);

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

  useEffect(() => {
    const handleChatUnreadCountChange = (event: Event) => {
      const unreadEvent = event as CustomEvent<number>;
      const nextCount = Number(unreadEvent.detail);

      setChatUnreadCount(Number.isFinite(nextCount) ? nextCount : 0);
    };

    window.addEventListener("chat-unread-count-changed", handleChatUnreadCountChange);

    return () => {
      window.removeEventListener("chat-unread-count-changed", handleChatUnreadCountChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      clearUserAuthClientState();
      setIsOpen(false);

      window.dispatchEvent(
        new CustomEvent("auth-state-changed", {
          detail: {
            isLoggedIn: false,
          },
        })
      );

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

      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("chat-widget-toggle"))}
        aria-label="채팅창 열기"
        className="relative flex h-6 w-6 items-center justify-center"
      >
        <Image
          src="/images/ChatIcon.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
          className="cursor-pointer"
        />

        {chatUnreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold leading-none text-white">
            {chatUnreadCount > 99 ? "99+" : chatUnreadCount}
          </span>
        )}
      </button>

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
              src={getProfileImageSrc(user.profileImageUrl)}
              alt={`${user.nickname} 프로필 이미지`}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />

            <p className="mx-3">{user.nickname}님</p>
          </div>

          {isOpen && (
            <div className="absolute right-0 top-10 z-[3100] flex w-40 flex-col gap-3 rounded-lg border bg-white p-3 shadow-lg">
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
