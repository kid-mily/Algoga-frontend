"use client";

import { MessageCircle, X } from "lucide-react";

type FloatingChatButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function FloatingChatButton({ isOpen, onClick }: FloatingChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "채팅창 닫기" : "채팅창 열기"}
      aria-expanded={isOpen}
      className="fixed bottom-8 right-10 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-[#439A97] text-white shadow-[0_12px_30px_rgba(67,154,151,0.35)] transition hover:bg-[#367c79] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#439A97]"
    >
      {isOpen ? <X size={26} aria-hidden="true" /> : <MessageCircle size={28} aria-hidden="true" />}
    </button>
  );
}
