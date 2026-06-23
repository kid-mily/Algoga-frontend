"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import MyPageSidebar from "@/features/mypage/MyPageSidebar";
import MyPageEditForm from "@/features/mypage/edit/MyPageEditForm";

import type { MyPageUser } from "@/features/mypage/types";
import { getMyPageUser } from "@/features/services/mypage.service";

export default function MyPageEditPage() {
  const router = useRouter();

  const [user, setUser] = useState<MyPageUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyPageUser();
        setUser(data);
      } catch (error) {
        console.error("마이페이지 수정 정보 조회 실패:", error);
        alert("로그인이 필요합니다.");
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const userInitial = useMemo(() => {
    const baseName = user?.nickname || user?.name || "김";
    return baseName.slice(0, 1);
  }, [user]);

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-64px)] w-full bg-[#f6f8fb]">
        <div className="grid min-h-[calc(100vh-64px)] w-full grid-cols-[240px_1fr] items-start">
          <aside className="h-full w-[240px] shrink-0 bg-white" />

          <section className="min-h-[calc(100vh-64px)] w-full p-6">
            <div className="flex min-h-[300px] max-w-3xl items-center justify-center rounded-2xl bg-white text-sm text-slate-500">
              회원 정보를 불러오는 중입니다.
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-[calc(100vh-64px)] w-full bg-[#f6f8fb]">
        <div className="grid min-h-[calc(100vh-64px)] w-full grid-cols-[240px_1fr] items-start">
          <aside className="h-full w-[240px] shrink-0 bg-white" />

          <section className="min-h-[calc(100vh-64px)] w-full p-6">
            <div className="flex min-h-[300px] max-w-3xl items-center justify-center rounded-2xl bg-white text-sm text-slate-500">
              회원 정보를 불러오지 못했습니다.
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] w-full bg-[#f6f8fb]">
      <div className="grid min-h-[calc(100vh-64px)] w-full grid-cols-[240px_1fr] items-start">
        <MyPageSidebar
          nickname={user.nickname}
          initial={userInitial}
          profileImageUrl={user.profileImageUrl}
        />

        <section className="min-h-[calc(100vh-64px)] min-w-0 w-full p-6">
          <div className="w-full mx-auto max-w-3xl">
            <MyPageEditForm user={user} initial={userInitial} />
          </div>
        </section>
      </div>
    </main>
  );
}