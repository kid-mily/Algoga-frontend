'use client'

import Link from "next/link";
import { useState } from "react";

export default function Profile() {

    // 임시 테스트용
    const [user, setUser] = useState({
        name: '홍길동',
        lastName: '홍',
        isLogin: false
    })

    // 드롭다운 메뉴 열림/닫힘 상태 관리
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex gap-6 items-center pr-5">
                <img src="/images/FriendIcon.svg" alt="친구" className="w-6 h-6 cursor-pointer" />
                <img src="/images/ChatIcon.svg" alt="채팅" className="w-6 h-6 cursor-pointer" />
                <img src="/images/NoticeIcon.svg" alt="알림" className="w-6 h-6 cursor-pointer" />
                
                {user.isLogin ? ( 
                    <div className="relative">
                        <div 
                            className="flex items-center cursor-pointer"
                            onClick={() => setIsOpen(!isOpen)}>
                                <img src="/images/DefaultImg.svg" alt="기본 이미지" className="w-8 h-8 flex items-center justify-center"/>
                                    {/* 회원가입하고 로그인 하면 기본이미지 고정 
                                        나중에 변경해야 됨*/}
                            <p className="mx-3">{user.name}님</p>
                        </div>

                        {isOpen && (
                            // z-10을 추가해서 메뉴가 다른 컨텐츠 밑으로 숨지 않게 함
                            <div className="absolute right-0 top-10 w-40 bg-white border rounded-lg shadow-lg p-3 flex flex-col gap-3 z-10">
                                <p className="cursor-pointer hover:text-[#286E6B]">마이페이지</p>
                                <hr />
                                <p className="cursor-pointer hover:text-red-500">로그아웃</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href='/user/auth/login'>
                    <p className="text-[#4A5568] font-medium cursor-pointer hover:underline">로그인</p>
                    </Link>
                )}
            </div>
    );
}