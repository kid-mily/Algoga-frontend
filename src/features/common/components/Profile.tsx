'use client'

import Link from "next/link";
import { useState } from "react";
import { logout } from "@/features/services/auth.service";

import Image from "next/image";
import CompleteModal from "./CompleteModal";

type Props = {
    user: {
        nickname: string;
    } | null;
}

export default function Profile({ user }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    
    // 상태 변수명을 logoutModal로 명확하게 사용
    const [logoutModal, setLogoutModal] = useState({ open: false });

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("로그아웃 API 호출 실패:", error);
        } finally {
            window.dispatchEvent(new Event("auth-state-changed"));
            // 모달 오픈
            setLogoutModal({ open: true });
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
                            <Link
                                href="/mypage" 
                                className="cursor-pointer hover:text-[#286E6B]"
                            >
                                마이페이지
                            </Link>
                            <hr />
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

            {/* 🌟 수정된 모달 호출 부분 */}
            <CompleteModal
                open={logoutModal.open}
                title="로그아웃"
                description="로그아웃이 완료되었습니다."
                buttonText="확인"
                onConfirm={() => {
                    setLogoutModal({ open: false });
                    window.location.href = "/auth/login"; // 확인 클릭 시 이동
                }}
            />
        </div>
    );
}
