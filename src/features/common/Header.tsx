'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Profile from "./Profile";
import { getMe } from "@/features/services/user.service"; // 경로 유지

// 유저 데이터 타입 정의 (필요에 따라 수정하세요)
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
    // 유저 상태 관리
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);

            try {
                const userData = await getMe();
                setUser(userData);
            } catch (error) {
                console.error("유저 정보 로드 실패:", error);
                setUser(null);
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

    // 데이터를 가져오는 동안 UI가 깨지거나 깜빡이는 것을 방지
    if (isLoading) {
        return <header className="bg-white w-full h-16 flex items-center justify-between px-5" />;
    }

    return (
        <header className="bg-white w-full h-16 flex items-center justify-between px-5">
            <Link href='/'> 
                <img src="/images/알고가_로고.png" alt="로고" className="w-[130px] h-[45px] cursor-pointer"/>
            </Link>
            <Navbar/>
            <Profile user={user}/>
        </header>
    );
}


