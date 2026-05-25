
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen">
      <section className="flex-1">
        {children}
      </section>
    </main>
  );
}