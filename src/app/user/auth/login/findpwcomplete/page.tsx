import LoginSidebar from "@/features/auth/components/loginsidebar";
import FindPwComplete from "@/features/auth/components/findpwcomplete";

export default function FindIdPage() {
  return (
    <main className="flex h-screen overflow-hidden bg-[#F8F8F8]">
      {/* 사이드바 */}
      <LoginSidebar
        title={{
          normal: "비밀번호를",
          accent: "찾으시나요?",
        }}
        description="등록된 이메일로 임시 비밀번호를 전송해드립니다."
      />

      {/* 오른쪽 영역 */}
      <section className="flex flex-1 items-center justify-center px-20">
        <div className="w-full max-w-[540px]">
            <FindPwComplete />
        </div>
      </section>
    </main>
  );
}