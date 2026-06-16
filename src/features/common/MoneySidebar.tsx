"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    name: "결제 내역 조회",
    href: "/moneyadmin/payments",
    icon: "/images/list.svg",
    activeIcon: "/images/list-active.svg",
  },
  {
    name: "환불 승인 관리",
    href: "/moneyadmin/refunds",
    icon: "/images/mcheck.svg",
    activeIcon: "/images/mcheck-active.svg",
  },
  {
    name: "월별 수익 조회",
    href: "/moneyadmin/revenue",
    icon: "/images/mchart.svg",
    activeIcon: "/images/mchart-active.svg",
  },
  {
    name: "쿠폰 사용 현황 조회",
    href: "/moneyadmin/coupons",
    icon: "/images/gift.svg",
    activeIcon: "/images/gift-active.svg",
  },
];

export default function MoneySidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[240px] flex-col border-r border-[#E4E7EC] bg-white">
      <div className="flex items-center gap-3 border-b border-[#E4E7EC] px-6 py-5">
        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#6FA8A5] text-white">
          $
        </div>
        <span className="text-[20px] font-semibold text-[#111827]">
          Finance Admin
        </span>
      </div>

      <nav className="flex-1 px-4 py-6" aria-label="정산 관리자 메뉴">
        <ul className="space-y-2">
          {menus.map((menu) => {
            const active =
              pathname === menu.href || pathname.startsWith(`${menu.href}/`);

            return (
              <li key={menu.href}>
                <Link
                  href={menu.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] ${
                    active
                      ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                      : "text-[#344054] hover:bg-[#F5F7FA]"
                  }`}
                >
                  <img
                    src={active ? menu.activeIcon : menu.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-[18px] w-[18px]"
                  />
                  {menu.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[#E4E7EC] p-4">
        <button className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] text-[#344054] hover:bg-[#F5F7FA]">
          <img src="/images/home.svg" alt="" className="h-[18px] w-[18px]" />
          로그아웃
        </button>

        <div className="mt-6 flex items-center gap-3 px-4">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#6FA8A5]">
            <img src="/images/profile.svg" alt="" className="h-[18px] w-[18px]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#111827]">김관리자</p>
            <p className="text-[13px] text-[#98A2B3]">finance@algoga.kr</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
