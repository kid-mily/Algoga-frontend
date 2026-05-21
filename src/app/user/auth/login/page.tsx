import LoginSidebar from "@/features/auth/components/loginsidebar";
import LoginForm from "@/features/auth/components/loginform";

export default function LoginPage() {
  return (
    <main className="flex h-screen overflow-hidden bg-white">
      {/* 사이드바 */}
      <LoginSidebar
        title={{
          normal: "세계를 알고",
          accent: "여행하세요",
        }}
        description="120개국 여행 강좌, AI 일정 추천, 실시간 항공·호텔 예약까지 하나의 플랫폼에서 해결하세요."
      />

      {/* 로그인 영역 */}
      <section className="flex flex-1 items-center justify-center pt-8 pb-8">
        <LoginForm />
      </section>
    </main>
  );
}