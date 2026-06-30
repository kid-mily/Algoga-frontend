interface MyPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function MyPageLayout({ title, children }: MyPageLayoutProps) {
  return (
    <div>
      <header className="mb-5">
        <h1 className="text-xl font-bold text-[#0A1628]">{title}</h1>
      </header>

      {children}
    </div>
  );
}