import Link from "next/link";
import { ReactNode } from "react";

interface QnaLayoutProps {
  continentCode: string;
  countryid: string;
  courseId: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function QnaLayout({
  continentCode,
  countryid,
  courseId,
  title,
  description,
  children,
}: QnaLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto w-full max-w-4xl">
        <header className="mb-6 rounded-[28px] border border-[#DDE8EF] bg-white px-6 py-6 shadow-[0_12px_32px_rgba(55,88,110,0.08)]">
          <Link
            href={`/classroom/${continentCode}/${countryid}/lecture/${courseId}/study`}
            className="inline-flex rounded-full border border-[#DDE8EF] bg-[#FAFCFE] px-4 py-2 text-xs font-bold text-[#439A97]"
          >
            강의실로 돌아가기
          </Link>

          <p className="mt-5 text-xs font-bold tracking-[0.22em] text-[#439A97]">
            CLASSROOM Q&A
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#0A1628]">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-[#718096]">{description}</p>
        </header>

        {children}
      </section>
    </main>
  );
}