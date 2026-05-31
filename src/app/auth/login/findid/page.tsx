import LoginSidebar from "@/features/auth/components/LoginSideBar";
import FindIdForm from "@/features/auth/components/FindIdForm";

export default function FindIdPage() {
  return (
    <main className="flex h-screen overflow-hidden bg-[#F8F8F8]">
      {/* 사이드바 */}
      <LoginSidebar
        title={{
          normal: "아이디를",
          accent: "찾으시나요?",
        }}
        description="가입 시 입력한 이름과 이메일로 아이디를 찾을 수 있습니다."
      />

      {/* 오른쪽 영역 */}
      <section className="flex flex-1 items-center justify-center px-20">
        <div className="w-full max-w-[540px]">
            <FindIdForm />
        </div>
      </section>
    </main>
  );
}