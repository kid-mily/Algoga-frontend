interface NoticeItemProps {
  category: string;
  title: string;
  date: string;
  color: string;
}

const badgeColor = {
  blue: 'bg-blue-50 text-blue-500',
  indigo: 'bg-indigo-50 text-indigo-500',
  gray: 'bg-slate-100 text-gray-500',
};

export default function NoticeItem({category, title, date, color}: NoticeItemProps) {
  return (
    <li className="flex items-center justify-between py-4 cursor-pointer">
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor[color as keyof typeof badgeColor]}`}
        >
          {category}
        </span>

        <span className="text-sm font-medium text-[#0A1628]">
          {title}
        </span>
      </div>

      <span className="text-sm text-gray-400">{date}</span>
    </li>
  );
}