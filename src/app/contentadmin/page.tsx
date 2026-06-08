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
    </div>
  );
}