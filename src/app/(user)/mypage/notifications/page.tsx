import MyPageLayout from "@/features/mypage/MyPageLayout";
import NotificationSettingsClient from "@/features/mypage/notifications/NotificationSettingsClient";

export default function NotificationSettingsPage() {
  return (
    <MyPageLayout title="알림 설정">
      <NotificationSettingsClient />
    </MyPageLayout>
  );
}