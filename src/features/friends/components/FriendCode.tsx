"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface FriendCodeProps {
  personalCode: string;
}

export default function FriendCode({ personalCode }: FriendCodeProps) {
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (copyStatus === "idle") return;

    const timer = setTimeout(() => {
      setCopyStatus("idle");
    }, 2000);

    return () => clearTimeout(timer);
  }, [copyStatus]);

  const handleCopy = async () => {
    if (!personalCode || copyStatus === "success") return;

    try {
      await navigator.clipboard.writeText(personalCode);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <article className="rounded-2xl border border-[#E5EDF5] bg-white p-5 shadow-sm">
      <p className="text-xs font-bold tracking-[0.14em] text-[#439A97]">
        MY CODE
      </p>

      <h2 className="mt-1 text-sm font-bold text-[#0A1628]">
        내 개인 번호
      </h2>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[#E5EDF5] bg-[#F8FBFD] px-4 py-1">
        <p className="min-w-0 break-all text-sm font-bold tracking-wide text-[#0A1628]">
          {personalCode || "개인 번호가 없습니다."}
        </p>

        <button
          type="button"
          onClick={handleCopy}
          disabled={!personalCode || copyStatus === "success"}
          aria-label="개인 번호 복사"
          title="개인 번호 복사"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-[#E8F5F4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Image
            src= "/images/copy.svg"
            alt=""
            width={18}
            height={18}
          />
        </button>
      </div>

      <p className="mt-3 text-xs leading-5 text-[#8A9BB0]">
        {copyStatus === "success"
          ? "개인 번호가 복사되었습니다."
          : copyStatus === "error"
            ? "복사에 실패했습니다. 다시 시도해 주세요."
            : "친구에게 이 번호를 알려주면 친구가 나를 찾을 수 있어요."}
      </p>
    </article>
  );
}