interface Props {
  title: string;
  description: string;
  price: number;
}

export default function CourseInfoCard({ title, description, price }: Props) {
  return (
    <section className="rounded-2xl border border-[#E1E8EF] bg-white p-6 shadow-[0_8px_24px_rgba(55,88,110,0.06)]">
      <p className="text-[10px] font-bold tracking-[0.16em] text-[#A0AEC0]">
        COURSE
      </p>

      <h2 className="mt-2 text-xl font-bold text-[#0A1628]">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-[#718096]">{description}</p>

      <div className="mt-5 flex items-center justify-between border-t border-[#EEF2F6] pt-4">
        <span className="text-sm font-medium text-[#667085]">강의 금액</span>
        <strong className="text-xl font-black text-[#0A1628]">
          {price.toLocaleString()}원
        </strong>
      </div>
    </section>
  );
}