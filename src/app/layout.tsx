import type { Metadata } from "next";
import ChatWidget from "@/features/chat/components/ChatWidget";
import "./globals.css";

const title = "여행을 떠나기 전, 제대로 알고 가자! ALGOGA"
const description = "여행지를 직접 선택하고, 그 나라의 문화·역사·언어를 강의로 배운 뒤 퀴즈로 확인하고, 항공권과 숙소까지 한 번에 예약할 수 있는 여행 학습 통합 플랫폼입니다.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://algoga.kro.kr'),

  title: {
    default: "ALGOGA",
    template: "%s | ALGOGA"
  },

  description,

  // 카톡, 슬랙, 페이스북 등 링크 공유 시 뜨는 미리보기 카드
    openGraph: {
    type: "website",
    title,
    description,
    siteName: "ALGOGA",
    locale: "ko_KR",
    images: [
      {
        url: "/images/og-image.png",
        width: 1100,
        height: 740,
        alt: "ALGOGA 여행 학습 통합 플랫폼",
      },
    ],
  },

  // 트위터
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-image.png"],
    creator: "@ALGOGA",
  }
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