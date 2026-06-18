interface NotificationToggleItemProps {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

export default function NotificationToggleItem({
  title,
  description,
  checked,
  onToggle,
}: NotificationToggleItemProps) {
  return (
    <article className="flex min-h-[64px] items-center justify-between gap-5 rounded-2xl border border-[#E5EAF1] bg-white px-5 py-3 shadow-sm">
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-[#111827]">
          {title}
        </h2>

        <p className="mt-1 truncate text-xs text-[#8492A6]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        className={`relative h-5 w-10 shrink-0 rounded-full transition ${
          checked ? "bg-[#62BF73]" : "bg-[#CBD5E1]"
        }`}
      >
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition ${
            checked ? "left-5" : "left-1"
          }`}
        />
      </button>
    </article>
  );
}