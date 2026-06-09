"use client";

import { useState } from "react";

export default function ContentPage() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      콘텐츠 매니저 메인 페이지
    </div>
  );
}