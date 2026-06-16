"use client";

import MyPageSidebar from "./MyPageSidebar";
import { useMyPage } from "./hooks/userMyPage";

interface MyPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function MyPageLayout({
  title,
  children,
}: MyPageLayoutProps) {
  const { user, isLoading, errorMessage } = useMyPage();

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F5F7FA]">
        <p className="text-sm font-medium text-[#8A9BB0]">
          마이페이지 정보를 불러오는 중입니다.
        </p>
      </main>
    );
  }

  if (errorMessage || !user) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F5F7FA] px-4">
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-[#0A1628]">
            정보를 불러올 수 없습니다
          </h1>

          <p className="mt-2 text-sm text-red-500">
            {errorMessage || "사용자 정보를 찾을 수 없습니다."}
          </p>
        </section>
      </main>
    );
  }

  const userInitial = user.name[0] ?? "?";

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F5F7FA]">
      <div className="flex w-full">
        <MyPageSidebar
          name={user.name}
          initial={userInitial}
          profileImageUrl={user.profileImageUrl}
        />

        <section className="flex-1 px-10 py-8">
          <div className="mx-auto w-full max-w-2xl">
            <header className="mb-5">
              <h1 className="text-xl font-bold text-[#0A1628]">
                {title}
              </h1>
            </header>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}