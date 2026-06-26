import LoginSidebar from "@/features/auth/components/LoginSideBar";
import AdminLoginForm from "@/features/admin/auth/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex h-screen overflow-hidden bg-[#F8F8F8]">
      {/* 사이드바 */}
      <LoginSidebar
        title={{
          normal: "관리자 페이지",
          accent: "로그인 하세요",
        }}

        description="강의, 쿠폰, 패키지, Q&A, 마일리지까지 관리자 기능을 한 곳에서 관리하세요."
      />
      {/* 로그인 영역 */}
      <section className="flex flex-1 items-center justify-center px-8 py-8">
        <AdminLoginForm />
      </section>
    </main>
  );
}
