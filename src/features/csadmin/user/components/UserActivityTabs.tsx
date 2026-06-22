import Link from "next/link";
import { UserActivityTab } from "@/features/csadmin/user/types";

interface UserActivityTabsProps {
  userId: string;
  activeTab: UserActivityTab;
}

export default function UserActivityTabs({
  userId,
  activeTab,
}: UserActivityTabsProps) {
  const tabs = [
    { key: "friends", label: "친구 목록", href: `/csadmin/user/${userId}/friend` },
    { key: "posts", label: "게시글 목록", href: `/csadmin/user/${userId}/post` },
    { key: "comments", label: "댓글 목록", href: `/csadmin/user/${userId}/comment` },
  ] as const;

  return (
    <nav className="flex border-b border-[#E4E7EC]" aria-label="유저 활동 탭">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={activeTab === tab.key ? "page" : undefined}
          className={`px-6 py-4 text-[14px] font-semibold ${
            activeTab === tab.key
              ? "border-b-2 border-[#639E9B] text-[#439A97]"
              : "text-[#344054]"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
