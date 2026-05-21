import LoginSidebar from "@/features/auth/components/loginsidebar";
export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      <LoginSidebar
        title={{
          normal: "세계를 알고",
          accent: "여행하세요",
        }}
        description="120개국 여행 강좌, AI 일정 추천, 실시간 항공·호텔 예약까지 하나의 플랫폼에서 해결하세요."
      />
    </main>
  );
}