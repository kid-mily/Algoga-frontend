// 채팅방 전체 상태 관리
"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// 채팅 본체(stompjs 등 무거운 의존성)는 별도 청크로 분리해, 실제 채팅을 쓰는 페이지에서만 로드합니다.
// 관리자 페이지에서는 아래 isAdminPage 분기로 이 청크 자체가 로드되지 않습니다.
// (루트 레이아웃에서 전역 렌더되므로 ssr:false는 정적 프리렌더를 깨뜨려 사용하지 않습니다.)
const ChatWidgetContent = dynamic(() => import("./ChatWidgetContent"));

const adminPathPrefixes = [
  "/auth/adminlogin",
  "/contentadmin",
  "/csadmin",
  "/moneyadmin",
  "/statisticadmin",
  "/superadmin",
];

export default function ChatWidget() {
  const pathname = usePathname();
  const isAdminPage = useMemo(
    () => adminPathPrefixes.some((prefix) => pathname.startsWith(prefix)),
    [pathname]
  );

  if (isAdminPage) return null;

  return <ChatWidgetContent />;
}
