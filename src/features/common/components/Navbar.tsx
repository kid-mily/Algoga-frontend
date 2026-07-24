import Link from "next/link";

type NavbarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

const links = [
  { href: "/classroom", label: "클래스룸" },
  { href: "/aischedule", label: "AI 일정" },
  { href: "/community", label: "커뮤니티" },
  { href: "/notice", label: "공지사항" },
];

export default function Navbar({
  mobile = false,
  onNavigate,
}: NavbarProps) {
  return (
    <nav
      aria-label="주요 메뉴"
      className={
        mobile
          ? "grid grid-cols-4"
          : "flex items-center gap-6 xl:gap-10"
      }
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className={
            mobile
              ? "px-1 py-2.5 text-center text-xs font-medium whitespace-nowrap text-[#344054] transition hover:text-[#286E6B] sm:text-sm"
              : "whitespace-nowrap font-medium text-[#4A5568] transition hover:text-[#286E6B]"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
