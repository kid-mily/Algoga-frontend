"use client";

import { useMemo } from "react";
import MyPageEditForm from "@/features/mypage/edit/MyPageEditForm";
import { useMyPageData } from "@/features/mypage/MyPageDataProvider";

export default function MyPageEditPage() {
  const { user } = useMyPageData();

  const userInitial = useMemo(() => {
    const baseName = user?.nickname || user?.name || "?";
    return baseName.slice(0, 1);
  }, [user]);

  if (!user) {
    return (
      <section className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white text-sm text-slate-500">
        회원 정보를 불러올 수 없습니다.
      </section>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <MyPageEditForm user={user} initial={userInitial} />
    </div>
  );
}