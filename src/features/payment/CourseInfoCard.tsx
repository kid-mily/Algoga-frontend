interface Props {
  title: string;
  description: string;
  price: number;
}

export default function CourseInfoCard({
  title,
  description,
  price,
}: Props) {
  return (
    <section className="rounded-[18px] border border-[#E4E7EC] bg-white p-6">
      <h2 className="text-lg font-bold text-[#0A1628]">
        {title}
      </h2>

      <p className="mt-2 text-sm text-[#667085]">
        {description}
      </p>

      <div className="mt-5 text-2xl font-bold text-[#0A1628]">
        {price.toLocaleString()}원
      </div>
    </section>
  );
}