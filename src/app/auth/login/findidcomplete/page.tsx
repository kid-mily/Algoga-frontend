import FindIdComplete from "@/features/auth/components/findidcomplete";
import LoginSidebar from "@/features/auth/components/loginsidebar";

export default function FindIdCompletePage() {
  return (
    <main className="flex h-screen items-center justify-center bg-[#F8F8F8]">
      <LoginSidebar
              title={{
                normal: "아이디를",
                accent: "찾으시나요?",
              }}
              description="가입 시 입력한 이름과 이메일로 아이디를 찾을 수 있습니다."
            />
    
     <section className="flex flex-1 items-center justify-center px-20">
<FindIdComplete userId="travel123" />
     </section>
    </main>
  );
}