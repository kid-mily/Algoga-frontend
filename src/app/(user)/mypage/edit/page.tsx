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
      <main className="min-h-screen bg-[#f6f8fb] pt-[72px]">
        <div className="mx-auto flex max-w-[1200px] gap-8 px-6 py-10">
          <aside className="w-[240px] shrink-0" />

          <section className="flex-1 rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
            회원 정보를 불러오는 중입니다.
          </section>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f6f8fb] pt-[72px]">
        <div className="mx-auto flex max-w-[1200px] gap-8 px-6 py-10">
          <aside className="w-[240px] shrink-0" />

          <section className="flex-1 rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
            회원 정보를 불러오지 못했습니다.
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] pt-[72px]">
      <div className="mx-auto flex max-w-[1200px] gap-8 px-6 py-10">
        <MyPageSidebar
            name={user.nickname || user.name}
            initial={userInitial}
            profileImageUrl={user.profileImageUrl}
        /> 

        <section className="min-w-0 flex-1">
          <MyPageEditForm user={user} initial={userInitial} />
        </section>
      </div>
    </main>
  );
}