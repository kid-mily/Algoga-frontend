"use client";

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
            // 브라우저 환경에서만 로컬 스토리지 접근
            const token = localStorage.getItem("accessToken");
            
            if (!token) {
                setIsLoading(false);
                return; // 토큰이 없으면 API 호출 건너뜀 (비로그인 상태)
            }

            try {
                // 토큰이 있을 때만 API 호출 (Axios 인터셉터가 헤더에 토큰을 실어줌)
                const userData = await getMe();
                setUser(userData);
            } catch (error) {
                console.error("유저 정보 로드 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    // 데이터를 가져오는 동안 UI가 깨지거나 깜빡이는 것을 방지
    if (isLoading) {
        return <header className="bg-white w-full h-16 flex items-center justify-between px-5" />;
    }

    // 🌟 요청하신 기존 UI/태그 구조 완벽 유지 🌟
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