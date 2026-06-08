import LoginSidebar from "@/features/auth/components/LoginSideBar";
import NewPwForm from "@/features/auth/components/NewPwForm";

export default function NewPwPage() {

  return (
    <main className="flex min-h-screen overflow-hidden bg-[#F8F8F8]">

      {/* 사이드바 */}
      <LoginSidebar
        title={{
          normal: "비밀번호",
          accent: "변경",
        }}
        description="새로운 비밀번호로 변경해주세요."
      />
      {/* 폼 */}
      <section className="flex flex-1 items-center justify-center px-10 py-10">
        <NewPwForm />
      </section>
    </main>
  );
}