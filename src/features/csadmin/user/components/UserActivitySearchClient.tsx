"use client";

import { FormEvent, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserActivitySearchClient() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const normalizedUserId = userId.trim();
  const normalizedUserIdNumber = Number(normalizedUserId);
  const canSearch =
    /^\d+$/.test(normalizedUserId) &&
    Number.isSafeInteger(normalizedUserIdNumber) &&
    normalizedUserIdNumber > 0;
  const errorId = "cs-user-id-error";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSearch) {
      setError("조회할 회원 ID를 숫자로 입력해주세요.");
      return;
    }

    setError("");
    router.push(`/csadmin/user/${normalizedUserId}/post`);
  };

  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white px-6 py-6">
      <form role="search" onSubmit={handleSubmit} className="max-w-[560px]">
        <label htmlFor="cs-user-id" className="text-[14px] font-semibold text-[#344054]">
          회원 ID
        </label>

        <div className="mt-3 flex gap-3">
          <input
            id="cs-user-id"
            value={userId}
            onChange={(event) => {
              setUserId(event.target.value);
              setError("");
            }}
            inputMode="numeric"
            placeholder="예: 1"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className="h-[44px] flex-1 rounded-[10px] border border-[#D0D5DD] px-4 text-[14px] outline-none focus:border-[#439A97]"
          />

          <button
            type="submit"
            className="h-[44px] rounded-[10px] bg-[#439A97] px-6 text-[14px] font-semibold text-white disabled:bg-[#C9D8D7]"
            disabled={!normalizedUserId}
          >
            활동 조회
          </button>
        </div>

        {error && (
          <p id={errorId} className="mt-2 text-[13px] font-medium text-[#DC2626]">
            {error}
          </p>
        )}
      </form>

      <div className="mt-6 grid gap-3 text-[14px] text-[#667085] md:grid-cols-3">
        <QuickLink disabled={!canSearch} onClick={() => router.push(`/csadmin/user/${normalizedUserId}/post`)}>
          게시글 목록 조회
        </QuickLink>
        <QuickLink disabled={!canSearch} onClick={() => router.push(`/csadmin/user/${normalizedUserId}/comment`)}>
          댓글 목록 조회
        </QuickLink>
        <QuickLink disabled={!canSearch} onClick={() => router.push(`/csadmin/user/${normalizedUserId}/friend`)}>
          친구 목록 확인
        </QuickLink>
      </div>
    </section>
  );
}

type QuickLinkProps = {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
};

function QuickLink({ children, disabled, onClick }: QuickLinkProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-[12px] border border-[#E4E7EC] px-4 py-3 text-left disabled:cursor-not-allowed disabled:text-[#98A2B3]"
    >
      {children}
    </button>
  );
}
