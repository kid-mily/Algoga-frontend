"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MyPageSidebarProps {
  nickname: string;
  initial: string;
  profileImageUrl?: string | null;
}

const menuItems = [
  { label: "내 정보", href: "/mypage", icon: "내" },
  { label: "알림 설정", href: "/mypage/notifications", icon: "알" },
  { label: "수강 내역", href: "/mypage/coursedetails", icon: "수" },
  { label: "예약 내역", href: "/mypage/reservations", icon: "예" },
  { label: "쿠폰함", href: "/mypage/benefits", icon: "쿠" },
  { label: "친구 관리", href: "/mypage/friends", icon: "친" },
];

export default function MyPageSidebar({
  nickname,
  initial,
  profileImageUrl,
}: MyPageSidebarProps) {
  const pathname = usePathname();

  const isActiveMenu = (href: string) => {
    if (href === "/mypage") {
      return pathname === "/mypage" || pathname === "/mypage/edit";
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="min-h-[calc(100vh-64px)] w-[240px] shrink-0 bg-white shadow-sm">
      <div className="bg-[#EAF3FF] px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#43A6A2] text-lg font-bold text-white">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={`${nickname} 프로필 이미지`}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              initial
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#0A1628]">
              {nickname}
            </p>
            <p className="mt-1 text-xs text-[#8A9BB0]">
              마이페이지
            </p>
          </div>
        </div>
      </div>

      <nav aria-label="마이페이지 메뉴" className="space-y-2 px-3 py-5">
        {menuItems.map((item) => {
          const isActive = isActiveMenu(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-12 items-center justify-between rounded-xl px-4 text-sm font-semibold transition ${
                isActive
                  ? "bg-[#43A6A2] text-white shadow-sm"
                  : "text-[#536579] hover:bg-[#F4F8FB] hover:text-[#0A1628]"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#F1F5F9] text-[#7B8A9A]"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </span>

              <span aria-hidden="true" className={isActive ? "text-white/80" : "text-[#B8C4D0]"}>
                ›
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
