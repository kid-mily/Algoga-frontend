import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MyPageDataProvider } from "@/features/mypage/MyPageDataProvider";
import MyPageShell from "@/features/mypage/MyPageShell";
import {
    getMyPageData,
    MyPageApiError,
} from "@/features/services/mypage.service";
import { getServerAuthHeaders } from "@/lib/serverAuthHeaders";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "마이페이지",
    description: "내 강의, 예약, 쿠폰과 마일리지 정보를 확인하세요.",
    openGraph: {
        title: "마이페이지 | ALGOGA",
        description: "내 강의, 예약, 쿠폰과 마일리지 정보를 확인하세요.",
        url: "/mypage",
    },
};

export default async function MyPageRouteLayout({ children }: {
    children: React.ReactNode;
}) {
    let initialData;

    try {
        initialData = await getMyPageData({
            includeReservationCount: true,
            headers: await getServerAuthHeaders(),
        });
    } catch (error) {
        if (
            error instanceof MyPageApiError &&
            (error.status === 401 || error.status === 403)
        ) {
            redirect("/auth/login");
        }

        throw error;
    }

    return (
        <MyPageDataProvider initialData={initialData}>
            <MyPageShell>{children}</MyPageShell>
        </MyPageDataProvider>
    );
}
