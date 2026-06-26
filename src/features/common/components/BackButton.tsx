"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function BackButton({
  className,
  children = "이전페이지 가기",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.back()} className={className}>
      {children}
    </button>
  );
}