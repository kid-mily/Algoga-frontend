"use client";

import WithdrawPageClient from "@/features/mypage/withdraw/WithdrawPageClient";
import { useMyPageData } from "@/features/mypage/MyPageDataProvider";

export default function MyPageWithdrawPage() {
  const { user, summary } = useMyPageData();

  if (!user) {
    return (
      <section className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white text-sm text-slate-500">
        회원 정보를 불러올 수 없습니다.
      </section>
    );
  }

  return <WithdrawPageClient user={user} summary={summary} />;
}
