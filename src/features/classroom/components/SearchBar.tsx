"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="mt-8 flex items-center gap-4">
      <div className="flex h-12 flex-1 items-center rounded-2xl border border-[#8A9BB0] bg-white px-6 shadow-sm">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          placeholder="여행지 검색..."
          className="w-full bg-transparent text-[#0A1628] outline-none placeholder:text-[#9AA6B2]"
        />
      </div>

      <button
        type="button"
        onClick={onSearch}
        className="h-12 w-32 cursor-pointer rounded-2xl bg-[#439A97] font-semibold text-white hover:bg-[#1f4644]"
      >
        검색
      </button>
    </div>
  );
}