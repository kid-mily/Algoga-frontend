"use client";

import MyPageSidebar from "./MyPageSidebar";
import { useMyPageData } from "./MyPageDataProvider";

export default function MyPageShell({ children }: {
    children: React.ReactNode;
}) {
    const { user, errorMessage } = useMyPageData();

    if (errorMessage || !user) {
        return (
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F5F7FA] px-4">
            <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <h1 className="text-lg font-bold text-[#0A1628]">
                    정보를 불러올 수 없습니다.
                </h1>

                <p className="mt-2 text-sm text-red-500">
                    {errorMessage || "사용자 정보를 찾을 수 없습니다."}
                </p>
            </section>
        </main>
        );
    }

    const userInitial = user.name[0] ?? user.nickname[0] ?? "?";

    return (
        <main className="min-h-[calc(100vh-64px)] bg-[#F5F7FA]">
            <div className="flex min-h-[calc(100vh-64px)] w-full">
                <MyPageSidebar
                nickname={user.nickname}
                initial={userInitial}
                profileImageUrl={user.profileImageUrl}
                />

                <section className="min-w-0 flex-1 px-10 py-8">
                    <div className="mx-auto w-full max-w-4xl">{children}</div>
                </section>
            </div>
        </main>
    );
}
