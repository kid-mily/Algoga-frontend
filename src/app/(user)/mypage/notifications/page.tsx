import MyPageSidebar from "@/features/mypage/MyPageSidebar";
import NotificationSettingsClient from "@/features/mypage/notifications/NotificationSettingsClient";


export default function NotificationSettingsPage() {
    return (
        <main className="flex min-h-screen bg-[#F5F7FA]">
            {/* 더미 */}
            <MyPageSidebar name="김여행" initial="김" />
            {/* <MyPageSidebar name={user.name} initial={user.name[0]} /> */}
            <section className="flex flex-1 justify-center px-10 py-20">
                <div className="w-full max-w-[760px]">
                <h1 className="mb-5 text-xl font-bold text-[#111827]">
                    알림 설정
                </h1>

                <NotificationSettingsClient />
                </div>
            </section>
        </main>
    );
}