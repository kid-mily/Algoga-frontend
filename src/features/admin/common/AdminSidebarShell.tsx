"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminLogout } from "@/features/services/adminAuth.service";
import { clearAdminSessionActive } from "@/features/admin/auth/services/adminSession";

export type AdminSidebarMenuItem = {
  name: string;
  href: string;
  icon: string;
  activeIcon: string;
};

export type AdminSidebarMenuSection = {
  label?: string;
  items: AdminSidebarMenuItem[];
};

type AdminSidebarShellProps = {
  badgeInitial: string;
  badgeColorClassName?: string;
  title: string;
  navLabel: string;
  sections: AdminSidebarMenuSection[];
  adminName: string;
  adminEmail: string;
  adminRole?: string;
  asideClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
};

const DEFAULT_ASIDE_CLASSNAME = "flex w-[240px] flex-col border-r border-[#E4E7EC] bg-white";
const DEFAULT_HEADER_CLASSNAME = "flex items-center gap-3 border-b border-[#E4E7EC] px-6 py-5";
const DEFAULT_TITLE_CLASSNAME = "truncate text-[20px] font-semibold text-[#111827]";

export default function AdminSidebarShell({
  badgeInitial,
  badgeColorClassName = "bg-[#6FA8A5]",
  title,
  navLabel,
  sections,
  adminName,
  adminEmail,
  adminRole,
  asideClassName = DEFAULT_ASIDE_CLASSNAME,
  headerClassName = DEFAULT_HEADER_CLASSNAME,
  titleClassName = DEFAULT_TITLE_CLASSNAME,
}: AdminSidebarShellProps) {
  const pathname = usePathname();
  const activeHref = sections
    .flatMap((section) => section.items)
    .map((menu) => menu.href)
    .filter(
      (href) => pathname === href || pathname.startsWith(`${href}/`)
    )
    .sort((first, second) => second.length - first.length)[0];

  const handleLogout = async () => {
    try {
      await adminLogout();
    } finally {
      clearAdminSessionActive();
      window.location.replace("/auth/adminlogin");
    }
  };

  return (
    <aside className={asideClassName}>
      <header className={headerClassName}>
        <div
          className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white ${badgeColorClassName}`}
        >
          {badgeInitial}
        </div>

        <span className={titleClassName}>{title}</span>
      </header>

      <nav className="flex-1 px-4 py-6" aria-label={navLabel}>
        {sections.map((section, sectionIndex) => (
          <div
            key={section.label ?? section.items[0]?.href ?? sectionIndex}
            className={sectionIndex === 0 ? "" : "mt-6"}
          >
            {section.label ? (
              <p className="mb-2 px-4 text-[12px] font-semibold text-[#98A2B3]">
                {section.label}
              </p>
            ) : null}

            <ul className="space-y-2">
              {section.items.map((menu) => {
                const isActive = menu.href === activeHref;

                return (
                  <li key={menu.href}>
                    <Link
                      href={menu.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] transition ${
                        isActive
                          ? "bg-[#E7F4EC] font-semibold text-[#439A97]"
                          : "text-[#344054] hover:bg-[#F5F7FA]"
                      }`}
                    >
                      <img
                        src={isActive ? menu.activeIcon : menu.icon}
                        alt=""
                        aria-hidden="true"
                        className="h-[19px] w-[19px]"
                      />
                      {menu.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <footer className="border-t border-[#E4E7EC] p-4">
        {adminRole === "SUPER_ADMIN" && !pathname.startsWith("/superadmin") ? (
          <Link
            href="/superadmin/manage"
            className="mb-2 flex w-full items-center rounded-[12px] bg-[#E7F4EC] px-4 py-3 text-[15px] font-semibold text-[#439A97] transition hover:bg-[#DCEFE4]"
          >
            슈퍼어드민으로 돌아가기
          </Link>
        ) : null}

        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[15px] text-[#344054] hover:bg-[#F5F7FA]"
        >
          <img
            src="/images/home.svg"
            alt=""
            aria-hidden="true"
            className="h-[19px] w-[19px]"
          />
          로그아웃
        </button>

        <div className="mt-6 flex items-center gap-3 px-4">
          <div
            className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-white ${badgeColorClassName}`}
          >
            <img
              src="/images/profile.svg"
              alt=""
              aria-hidden="true"
              className="h-[18px] w-[18px]"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#111827]">
              {adminName}
            </p>
            <p className="truncate text-[13px] text-[#98A2B3]">{adminEmail}</p>
          </div>
        </div>
      </footer>
    </aside>
  );
}
