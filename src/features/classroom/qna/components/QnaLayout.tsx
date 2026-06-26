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

export default function QnaLayout({ continentCode, countryid, courseId, title, description, children }: QnaLayoutProps) {
    return (
        <main className="min-h-screen bg-[#F5F6FA] px-6 py-12">
            <section className="mx-auto w-full max-w-3xl">
                <Link
                    href={`/classroom/${continentCode}/${countryid}/lecture/${courseId}/study`}
                    className="mb-6 inline-block text-sm font-medium text-[#4F7DB8]"
                >
                  &lt; 강의실로 돌아가기
                </Link>

                <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#0A1628]">{title}</h1>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
                </header>

                {children}
            </section>
        </main>
    );
}