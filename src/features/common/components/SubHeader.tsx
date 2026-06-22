import Link from "next/link";
import Image from "next/image";

interface SubHeaderProps {
  backHref: string;
  backText: string;
  title: string;
  description?: string;
}

export default function SubHeader({
  backHref,
  backText,
  title,
  description,
}: SubHeaderProps) {
  return (
    <div className="mb-6">
      <Link
        href={backHref}
        className="flex items-center gap-2 text-[13px] font-medium text-[#667085] transition hover:text-[#111827]"
      >
        <Image
          src="/images/arrow.svg"
          alt="화살표"
          width={14}
          height={14}
        />
        {backText}
      </Link>

      <h1 className="mt-3 text-[28px] font-bold leading-[1.2] text-[#111827]">
        {title}
      </h1>

      {description && (
        <p className="mt-1 text-[15px] font-medium text-[#98A2B3]">
          {description}
        </p>
      )}
    </div>
  );
}
