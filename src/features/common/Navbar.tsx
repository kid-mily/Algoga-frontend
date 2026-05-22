import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex gap-10 items-center">
            <Link href="/classroom" >
            <p className="text-[#4A5568] font-medium cursor-pointer hover:text-[#286E6B]">클래스룸</p>
            </Link>
            <p className="text-[#4A5568] font-medium cursor-pointer hover:text-[#286E6B]">AI일정</p>
            <p className="text-[#4A5568] font-medium cursor-pointer hover:text-[#286E6B]">예약</p>
            <p className="text-[#4A5568] font-medium cursor-pointer hover:text-[#286E6B]">커뮤니티</p>
            <p className="text-[#4A5568] font-medium cursor-pointer hover:text-[#286E6B]">공지사항</p>   
        </nav>
    );
}