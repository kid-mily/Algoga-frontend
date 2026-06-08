'use client'

import FindIdComplete from "@/features/auth/components/FindIdComplete";
import LoginSidebar from "@/features/auth/components/LoginSideBar";
import { useEffect, useState } from "react";

export default function FindIdCompletePage() {
    // 컴포넌트 안쪽에 아래 코드 추가
  const [userId, setUserId] = useState("");
  useEffect(() => {
    setUserId(sessionStorage.getItem("foundUserId") || "알 수 없음");
  }, []);
  
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
        <FindIdComplete userId={userId} />
     </section>
    </main>
  );
}