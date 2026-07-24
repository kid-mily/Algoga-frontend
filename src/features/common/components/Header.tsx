"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getMe } from "@/features/services/user.service";
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
    return <header className="relative z-[3000] h-24 w-full bg-white lg:h-16" />;
  }

  return (
    <header className="relative z-[3000] w-full border-b border-[#EEF1F3] bg-white">
      <div className="mx-auto grid w-full grid-cols-[1fr_auto] items-center px-4 pt-2 sm:px-6 lg:h-16 lg:grid-cols-[1fr_auto_1fr] lg:px-8 lg:py-0">
        <Link href="/" className="w-fit">
          <Image
            src="/images/algoga-logo.png"
            alt="알고가"
            width={130}
            height={45}
            priority
            className="h-auto w-[105px] cursor-pointer sm:w-[115px] lg:w-[130px]"
          />
        </Link>

        <div className="hidden lg:block">
          <Navbar />
        </div>

        <div className="flex justify-end">
          <Profile user={user} mobile />
        </div>

        <div className="col-span-2 mt-1 border-t border-[#F2F4F7] lg:hidden">
          <Navbar mobile />
        </div>
      </div>
    </header>
  );
}

