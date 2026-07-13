import Image from "next/image";
import BackButton from "@/features/common/components/BackButton";

interface MyPageLayoutProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  children: React.ReactNode;
}

export default function MyPageLayout({
  title,
  description,
  showBackButton = false,
  children,
}: MyPageLayoutProps) {
  return (
    <div>
      <header className="mb-5">
        <h1 className="text-xl font-bold text-[#0A1628]">{title}</h1>

        {description && (
          <p className="mt-1 text-sm text-[#8A9BB0]">{description}</p>
        )}
      </header>

      {children}
    </div>
  );
}
