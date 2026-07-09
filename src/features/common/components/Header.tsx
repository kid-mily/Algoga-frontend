"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getMe } from "@/features/services/user.service";
import AuthSessionTimer from "./AuthSessionTimer";
import Navbar from "./Navbar";
import Profile from "./Profile";

interface UserProfile {
  username: string;
  name: string;
  nickname: string;
  email: string;
  profileImageUrl?: string | null;
  phone: string;
  gender: string;
  birthDate: string;
}

export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);

      try {
        const userData = await getMe();
        setUser(userData);
      } catch {
        setUser((prevUser) => prevUser);
      } finally {
        setIsLoading(false);
      }
    };

    const handleProfileUpdated = (event: Event) => {
      const profileEvent = event as CustomEvent<{
        nickname?: string;
        profileImageUrl?: string | null;
      }>;
      const nextProfile = profileEvent.detail;

      if (!nextProfile) return;

      setUser((prevUser) => {
        if (!prevUser) return prevUser;

        return {
          ...prevUser,
          nickname: nextProfile.nickname ?? prevUser.nickname,
          profileImageUrl:
            nextProfile.profileImageUrl === undefined
              ? prevUser.profileImageUrl
              : nextProfile.profileImageUrl,
        };
      });
    };

    const handleAuthStateChanged = (event: Event) => {
      const authEvent = event as CustomEvent<{ isLoggedIn?: boolean }>;

      if (authEvent.detail?.isLoggedIn === false) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      void fetchUser();
    };

    fetchUser();
    window.addEventListener("auth-state-changed", handleAuthStateChanged);
    window.addEventListener("profile-updated", handleProfileUpdated);

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthStateChanged);
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, []);

  if (isLoading) {
    return (
      <header className="relative z-[3000] flex h-16 w-full items-center justify-between bg-white px-5" />
    );
  }

  return (
    <header className="relative z-[3000] flex h-16 w-full items-center justify-between bg-white px-5">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image
            src="/images/algoga-logo.png"
            alt="로고"
            width={130}
            height={45}
            className="h-[45px] w-[130px] cursor-pointer"
          />
        </Link>
        {user && <AuthSessionTimer />}
      </div>
      <Navbar />
      <Profile user={user} />
    </header>
  );
}

