import Link from "next/link";
import { CourseQna } from "../types";

interface CourseQnaCardProps {
  qna: CourseQna;
  href: string;
}

export default function CourseQnaCard({ qna, href }: CourseQnaCardProps) {
  return (
    <article className="rounded-[16px] border border-[#E4E7EC] bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <section className="min-w-0">
          <Link
            href={href}
            className="block truncate text-[18px] font-bold text-[#111827] hover:text-[#439A97]"
          >
            {qna.title}
          </Link>
          <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-[#667085]">
            {qna.content || "질문 내용이 없습니다."}
          </p>
        </section>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold ${
            qna.isAnswered
              ? "bg-[#ECFDF3] text-[#16A34A]"
              : "bg-[#FFF7ED] text-[#EA580C]"
          }`}
        >
          {qna.isAnswered ? "답변 완료" : "답변 대기"}
        </span>
      </header>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#98A2B3]">
        <span>{qna.writer}</span>
        <time dateTime={qna.createdAt}>{qna.createdAt || "-"}</time>
      </footer>
    </article>
  );
}
