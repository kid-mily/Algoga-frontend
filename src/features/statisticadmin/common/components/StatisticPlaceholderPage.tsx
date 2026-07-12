type StatisticPlaceholderPageProps = {
  title: string;
  description: string;
};

export default function StatisticPlaceholderPage({
  title,
  description,
}: StatisticPlaceholderPageProps) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] p-10">
      <section className="rounded-[20px] border border-[#E4E7EC] bg-white p-8">
        <p className="text-[14px] font-semibold text-[#439A97]">
          통계 관리자
        </p>
        <h1 className="mt-3 text-[32px] font-bold text-[#111827]">{title}</h1>
        <p className="mt-4 text-[16px] leading-7 text-[#667085]">
          {description}
        </p>
      </section>
    </main>
  );
}
