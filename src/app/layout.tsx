import GlobalErrorModal from "@/features/common/ErrorModal";
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

        {children}
      </body>
    </html>
  );
}