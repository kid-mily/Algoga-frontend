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
  profileImageUrl?: string;
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

    fetchUser();
    window.addEventListener("auth-state-changed", fetchUser);

    return () => {
      window.removeEventListener("auth-state-changed", fetchUser);
    };
  }, []);

  if (isLoading) {
    return (
      <header className="flex h-16 w-full items-center justify-between bg-white px-5" />
    );
  }

  return (
    <header className="flex h-16 w-full items-center justify-between bg-white px-5">
      <Link href="/">
        <Image
          src="/images/알고가_로고.png"
          alt="로고"
          width={130}
          height={45}
          className="h-[45px] w-[130px] cursor-pointer"
        />
      </Link>
      <Navbar />
      <Profile user={user} />
    </header>
  );
}