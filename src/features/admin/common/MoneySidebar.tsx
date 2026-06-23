"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getCurrentAdminPayload } from "@/lib/adminToken";
import { adminLogout } from "@/features/services/adminAuth.service";

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
];

export default function MoneySidebar() {
  const pathname = usePathname();
  const adminPayload = getCurrentAdminPayload();
  const adminName = adminPayload?.sub ?? "정산 관리자";
  const adminEmail = adminPayload?.role ?? adminPayload?.authority ?? "SETTLEMENT_MANAGER";

  const handleLogout = async () => {
    await Promise.resolve(adminLogout());
    window.location.replace("/auth/adminlogin");
  };

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
            // Nested moneyadmin routes should keep their parent menu active.
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
                  <Image
                    src={active ? menu.activeIcon : menu.icon}
                    alt=""
                    aria-hidden="true"
                    width={18}
                    height={18}
                    priority={false}
                  />
                  {menu.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[#E4E7EC] p-4">
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] text-[#344054] hover:bg-[#F5F7FA]"
        >
          <Image src="/images/home.svg" alt="" aria-hidden="true" width={18} height={18} />
          로그아웃
        </button>

        <div className="mt-6 flex items-center gap-3 px-4">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#6FA8A5]">
            <Image src="/images/profile.svg" alt="" aria-hidden="true" width={18} height={18} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#111827]">{adminName}</p>
            <p className="text-[13px] text-[#98A2B3]">{adminEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
