import type { Metadata } from "next";
import ChatWidget from "@/features/chat/components/ChatWidget";
import FriendPanel from "@/features/friends/components/FriendPanel";
import AiChatbotWidget from "@/features/chatbot/components/AiChatbotWidget";
import SessionExpiredModal from "@/features/common/components/SessionExpiredModal";
import { getSiteUrl } from "@/features/seo/site";
import "./globals.css";

const SITE_URL = getSiteUrl();

const title = "여행을 떠나기 전, 제대로 알고 가자! ALGOGA";
const description =
  "여행지를 직접 선택하고, 그 나라의 문화·역사·언어를 강의로 배운 뒤 퀴즈로 확인하고, 항공권과 숙소까지 한 번에 예약할 수 있는 여행 학습 통합 플랫폼입니다.";

export const metadata: Metadata = {
  ...(SITE_URL && { metadataBase: new URL(SITE_URL) }),

  title: {
    default: "ALGOGA",
    template: "%s | ALGOGA",
  },

  description,

  keywords: [
    "알고가",
    "ALGOGA",
    "여행 LMS",
    "여행 강의",
    "국가별 강의",
    "AI 여행 일정",
  ],

  openGraph: {
    type: "website",
    title,
    description,
    ...(SITE_URL && { url: SITE_URL }),
    siteName: "ALGOGA",
    locale: "ko_KR",
    images: [
      {
        url: "/images/og-image-v3.png",
        width: 1100,
        height: 740,
        alt: "ALGOGA 여행 학습 통합 플랫폼",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-image-v3.png"],
    creator: "@ALGOGA",
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
        <SessionExpiredModal />
        <ChatWidget />
        <FriendPanel />
        <AiChatbotWidget />
        {children}
      </body>
    </html>
  );
}
