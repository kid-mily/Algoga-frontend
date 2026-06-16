"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MyPageSidebarProps {
  name: string;
  initial: string;
  profileImageUrl?: string | null;
}

const menuItems = [
  {
    label: "내 정보",
    href: "/mypage",
    icon: "내",
    match: (pathname: string) =>
      pathname === "/mypage" || pathname === "/mypage/edit",
  },
  {
    label: "알림 설정",
    href: "/mypage/notifications",
    icon: "알",
    match: (pathname: string) => pathname.startsWith("/mypage/notifications"),
  },
  {
    label: "수강 내역",
    href: "/mypage/courses",
    icon: "수",
    match: (pathname: string) => pathname.startsWith("/mypage/courses"),
  },
  {
    label: "예약 내역",
    href: "/mypage/reservations",
    icon: "예",
    match: (pathname: string) => pathname.startsWith("/mypage/reservations"),
  },
  {
    label: "쿠폰함",
    href: "/mypage/coupons",
    icon: "쿠",
    match: (pathname: string) => pathname.startsWith("/mypage/coupons"),
  },
  {
    label: "디데이 설정",
    href: "/mypage/dday",
    icon: "D",
    match: (pathname: string) => pathname.startsWith("/mypage/dday"),
  },
  {
    label: "친구 관리",
    href: "/mypage/friends",
    icon: "친",
    match: (pathname: string) => pathname.startsWith("/mypage/friends"),
  },
];

export default function MyPageSidebar({
  name,
  initial,
  profileImageUrl,
}: MyPageSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] shrink-0 rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#5f9c98] text-lg font-bold text-white">
          {profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profileImageUrl}
              alt={`${name} 프로필 이미지`}
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">{name}</p>
          <p className="mt-1 text-xs text-slate-400">마이페이지</p>
        </div>
      </div>

      <nav className="space-y-1 p-3">
        {menuItems.map((item) => {
          const isActive = item.match(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex h-12 items-center justify-between rounded-xl px-4 text-sm font-medium transition",
                isActive
                  ? "bg-[#5f9c98] text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                <span className="truncate">{item.label}</span>
              </span>

              <span
                className={[
                  "text-lg leading-none",
                  isActive ? "text-white/80" : "text-slate-300",
                ].join(" ")}
                aria-hidden="true"
              >
                ›
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}