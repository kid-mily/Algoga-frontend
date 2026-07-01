import type { Metadata } from "next";
import { MyPageDataProvider } from "@/features/mypage/MyPageDataProvider";
import MyPageShell from "@/features/mypage/MyPageShell";

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

export default function MyPageRouteLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <MyPageDataProvider>
            <MyPageShell>{children}</MyPageShell>
        </MyPageDataProvider>
    );
}