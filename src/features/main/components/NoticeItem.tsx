import Link from "next/link";

interface NoticeItemProps {
  noticeId: number;
  category: string;
  title: string;
  date: string;
  color: string;
}

const badgeColor = {
  blue: "bg-blue-50 text-blue-500",
  indigo: "bg-indigo-50 text-indigo-500",
  gray: "bg-slate-100 text-gray-500",
};

export default function NoticeItem({
  noticeId,
  category,
  title,
  date,
  color,
}: NoticeItemProps) {
  return (
    <li>
      <Link
        href={`/notice/${noticeId}`}
        className="flex items-center justify-between py-4 transition hover:bg-gray-50"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              badgeColor[color as keyof typeof badgeColor]
            }`}
          >
            {category}
          </span>

          <span className="truncate text-sm font-medium text-[#0A1628]">
            {title}
          </span>
        </div>

        <span className="shrink-0 pl-4 text-sm text-gray-400">{date}</span>
      </Link>
    </li>
  );
}