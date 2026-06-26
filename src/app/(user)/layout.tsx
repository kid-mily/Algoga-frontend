import Footer from "@/features/common/components/Footer";
import Header from "@/features/common/components/Header";
import "../globals.css";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
