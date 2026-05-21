'use client'

import { useState } from "react"

export default function Header() {

    // 임시 테스트용
    const [user, setUser] = useState({
        name: '홍길동',
        lastName: '홍',
        isLogin: true
    })

    // 드롭다운 메뉴 열림/닫힘 상태 관리
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-white w-full h-16 flex items-center justify-between px-5">
            <img src="/images/알고가_로고.png" alt="로고" className="w-[130px] h-[45px] cursor-pointer"/>
            <nav className="flex gap-10 items-center">
                <p className="text-[#4A5568] font-medium cursor-pointer hover:text-[#286E6B]">메인</p>
                <p className="text-[#4A5568] font-medium cursor-pointer hover:text-[#286E6B]">클래스룸</p>
                <p className="text-[#4A5568] font-medium cursor-pointer hover:text-[#286E6B]">AI일정</p>
                <p className="text-[#4A5568] font-medium cursor-pointer hover:text-[#286E6B]">예약</p>
                <p className="text-[#4A5568] font-medium cursor-pointer hover:text-[#286E6B]">커뮤니티</p>
                <p className="text-[#4A5568] font-medium cursor-pointer hover:text-[#286E6B]">공지사항</p>   
            </nav>

            <div className="flex gap-6 items-center pr-5">
                <img src="/images/FriendIcon.svg" alt="친구" className="w-6 h-6 cursor-pointer" />
                <img src="/images/ChatIcon.svg" alt="채팅" className="w-6 h-6 cursor-pointer" />
                <img src="/images/NoticeIcon.svg" alt="알림" className="w-6 h-6 cursor-pointer" />
                
                {user.isLogin ? ( 
                    <div className="relative">
                        <div 
                            className="flex items-center cursor-pointer"
                            onClick={() => setIsOpen(!isOpen)}>
                                <div className="w-8 h-8 bg-[#439A97] rounded-full flex items-center justify-center text-xs font-bold text-white">
                                    {user.lastName}
                                </div>
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
                    <p className="text-[#4A5568] font-medium cursor-pointer hover:underline">로그인</p>
                )}
            </div>
        </header>
    )
}