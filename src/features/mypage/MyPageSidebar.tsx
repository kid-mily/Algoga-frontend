"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MyPageSidebarProps {
  name: string;
  initial: string;
}

const menuItems = [
  { label: "내 정보", href: "/mypage" },
  { label: "알림 설정", href: "/mypage/notifications" },
  { label: "수강 내역", href: "/mypage/courses" },
  { label: "예약 내역", href: "/mypage/reservations" },
  { label: "쿠폰함", href: "/mypage/coupons" },
  { label: "데이터 설정", href: "/mypage/settings" },
  { label: "친구 관리", href: "/mypage/friends" },
];

export default function MyPageSidebar({
  name,
  initial,
}: MyPageSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="min-h-[calc(100vh-64px)] w-60 shrink-0 border-r border-[#E8EEF5] bg-white">
      <header className="flex items-center gap-3 bg-[#EAF3FF] px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#43A6A2] text-lg font-bold text-white">
          {initial}
        </div>

        <div>
          <p className="font-bold text-[#0A1628]">{name}</p>
          <p className="mt-0.5 text-xs text-[#8A9BB0]">
            마이페이지
          </p>
        </div>
      </header>

      <nav aria-label="마이페이지 메뉴" className="px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/mypage"
                ? pathname === "/mypage"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#43A6A2] text-white"
                      : "text-[#526173] hover:bg-[#F1F7F7] hover:text-[#2F8F8B]"
                  }`}
                >
                  <span>{item.label}</span>

                  {!isActive && (
                    <span
                      aria-hidden="true"
                      className="text-xs text-[#B8C4D0]"
                    >
                      &gt;
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}