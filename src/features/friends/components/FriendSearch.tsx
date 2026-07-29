import Image from "next/image";

interface FriendSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function FriendSearch({ value, onChange }: FriendSearchProps) {
  return (
    <div className="flex h-10 items-center gap-2 rounded-xl border border-[#E5EDF5] bg-white px-3 transition focus-within:border-[#439A97]">
      <Image
        src="/images/search.svg"
        alt=""
        width={16}
        height={16}
        aria-hidden="true"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="친구 닉네임으로 검색"
        className="min-w-0 flex-1 bg-transparent text-sm text-[#0A1628] outline-none placeholder:text-[#9AA6B0]"
      />
    </div>
  );
}
