'use client'

import Link from "next/link";
import { useState } from "react";

type Props = {
    user: {
        nickname: string;
    } | null;
}

export default function Profile({ user }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    // 🌟 로그아웃 처리 함수
    const handleLogout = () => {
        // 1. 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // 2. 알림 메시지 (선택 사항)
        alert("로그아웃 되었습니다.");

        // 3. 로그인 페이지로 이동 (window.location을 사용하면 Header의 유저 상태까지 완벽히 새로고침 되어 비워집니다)
        window.location.href = "/auth/login";
    };

    return (
        <div className="flex gap-6 items-center pr-5">

            <img src="/images/FriendIcon.svg" alt="친구" className="w-6 h-6 cursor-pointer" />
            <img src="/images/ChatIcon.svg" alt="채팅" className="w-6 h-6 cursor-pointer" />
            <img src="/images/NoticeIcon.svg" alt="알림" className="w-6 h-6 cursor-pointer" />
            {user ? (
                <div className="relative">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <img
                            src="/images/DefaultImg.svg"
                            alt="기본 이미지"
                            className="w-8 h-8 flex items-center justify-center"
                        />
                        <p className="mx-3">
                            {user.nickname}님
                        </p>
                    </div>
                    {isOpen && (
                        <div className="absolute right-0 top-10 w-40 bg-white border rounded-lg shadow-lg p-3 flex flex-col gap-3 z-10">
                            <p className="cursor-pointer hover:text-[#286E6B]">
                                마이페이지
                            </p>
                            <hr />
                            {/* 🌟 onClick 이벤트에 handleLogout 연결 */}
                            <p 
                                className="cursor-pointer hover:text-red-500"
                                onClick={handleLogout}
                            >
                                로그아웃
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <Link href='/auth/login'>
                    <p className="text-[#4A5568] font-medium cursor-pointer hover:underline">
                        로그인
                    </p>
                </Link>
            )}
        </div>
    );
}