export interface FriendTabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface FriendTabsProps<T extends string> {
  items: FriendTabItem<T>[];
  activeValue: T;
  onChange: (value: T) => void;
  variant?: "pill" | "underline";
}

export default function FriendTabs<T extends string>({
  items,
  activeValue,
  onChange,
  variant = "pill",
}: FriendTabsProps<T>) {
  if (variant === "underline") {
    return (
      <div className="flex gap-5 overflow-x-auto">
        {items.map((item) => {
          const isActive = item.value === activeValue;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-1 pb-3 text-sm font-bold transition ${
                isActive
                  ? "border-[#439A97] text-[#439A97]"
                  : "border-transparent text-[#718096] hover:text-[#0A1628]"
              }`}
            >
              {item.label}

              {typeof item.count === "number" && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                    isActive
                      ? "bg-[#EEF8F7] text-[#439A97]"
                      : "bg-[#F3F8FC] text-[#8A9BB0]"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-2 px-5 py-3">
      {items.map((item) => {
        const isActive = item.value === activeValue;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`h-8 rounded-full px-4 text-xs font-bold transition ${
              isActive
                ? "bg-[#439A97] text-white"
                : "bg-[#F3F8FC] text-[#0A1628] hover:bg-[#EEF8F7]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}