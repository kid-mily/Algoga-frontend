import { MyPageDataProvider } from "@/features/mypage/MyPageDataProvider";
import MyPageShell from "@/features/mypage/MyPageShell";


export default function MyPageRouteLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <MyPageDataProvider>
            <MyPageShell>{children}</MyPageShell>
        </MyPageDataProvider>
    );
}