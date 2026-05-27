"use client";

import { useState } from "react";
import Modal from "@/features/common/Modal";
import CheckModal from "@/features/common/CheckModal";
import CompleteModal from "@/features/common/CompleteModal";

export default function ContentPage() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      콘텐츠 매니저 메인 페이지

      {/* <Modal
        open={open}
        onConfirm={() => console.log("확인")}
        onCancel={() => setOpen(false)}
      /> */}

       {/* <CheckModal
      open={open}
      title="완료되었습니다"
      description="등록이 완료되었습니다."
      onConfirm={() => setOpen(false)}
    /> */}


    {/* <CompleteModal
      open={open}
      title="알림"
      description="로그인에 성공하였습니다."
      onConfirm={() => setOpen(false)}
    /> */}
    </div>
  );
}