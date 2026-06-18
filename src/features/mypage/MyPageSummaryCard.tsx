import Link from "next/link";

interface MyPageSummaryCardProps {
  count: number;
  label: string;
  href: string;
}

export default function MyPageSummaryCard({
  count,
  label,
  href
}: MyPageSummaryCardProps) {
  return (
    <Link
      href = {href}
      className="rounded-2xl border border-[#E5EDF5] bg-white p-6 text-center shadow-sm">
      <p className="text-2xl font-bold text-[#0A1628]">
        {count.toLocaleString()}
      </p>

      <p className="mt-1 text-sm text-[#8A9BB0]">
        {label}
      </p>
    </Link>
  );
}