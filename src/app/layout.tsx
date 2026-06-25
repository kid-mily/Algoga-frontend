import GlobalErrorModal from "@/features/common/components/ErrorModal";
import ChatWidget from "@/features/chat/components/ChatWidget";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalErrorModal />
        <ChatWidget />

        {children}
      </body>
    </html>
  );
}
