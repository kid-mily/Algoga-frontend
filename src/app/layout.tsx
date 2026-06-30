import type { Metadata } from "next";
import ChatWidget from "@/features/chat/components/ChatWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "알고가 | 여행으로 배우는 LMS",
    template: "%s | 알고가",
  },
  description:
    "알고가는 국가별 여행 강의, AI 일정 추천, 캘린더, 공지사항을 한 번에 제공하는 여행 학습 플랫폼입니다.",
  keywords: ["알고가", "여행 LMS", "여행 강의", "국가별 강의", "AI 여행 일정"],
  openGraph: {
    title: "알고가 | 여행으로 배우는 LMS",
    description:
      "국가를 선택하고 여행처럼 배우는 맞춤형 온라인 강의 플랫폼입니다.",
    siteName: "알고가",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ChatWidget />
        {children}
      </body>
    </html>
  );
}