"use client";

import Link from "next/link";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import LoadingSpinner from "@/features/common/LoadingSpinner";
import { useCourseQnaList } from "../hooks/useCourseQnaList";
import CourseQnaCard from "./CourseQnaCard";

interface CourseQnaListClientProps {
  continentCode: string;
  countryId: string;
  courseId: string;
}

export default function CourseQnaListClient({
  continentCode,
  countryId,
  courseId,
}: CourseQnaListClientProps) {
  const { qnas, isLoading, error } = useCourseQnaList(courseId);
  const basePath = `/classroom/${continentCode}/${countryId}/lecture/${courseId}/qna`;

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
        backText="강의 상세로 돌아가기"
        title="강의 Q&A"
        description="강의에 대해 궁금한 내용을 질문하고 답변을 확인합니다"
      />

      <section className="mt-5 flex justify-end">
        <Link
          href={`${basePath}/new`}
          className="rounded-[14px] bg-[#439A97] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#357c7a]"
        >
          질문 작성
        </Link>
      </section>

      {error && (
        <section
          role="alert"
          className="mt-4 rounded-[12px] border border-[#DC2626] bg-[#FEF2F2] p-4 text-[14px] font-medium text-[#DC2626]"
        >
          {error}
        </section>
      )}

      <section
        aria-labelledby="course-qna-list-title"
        aria-busy={isLoading}
        className="mt-5"
      >
        <h2 id="course-qna-list-title" className="sr-only">
          강의 Q&A 목록
        </h2>

        {isLoading ? (
          <section className="rounded-[16px] bg-white">
            <LoadingSpinner text="Q&A 목록을 불러오는 중입니다..." />
          </section>
        ) : qnas.length === 0 ? (
          <section className="rounded-[16px] bg-white p-10 text-center text-[14px] text-[#667085]">
            아직 등록된 Q&A가 없습니다.
          </section>
        ) : (
          <ol className="space-y-4">
            {qnas.map((qna) => (
              <li key={qna.id}>
                <CourseQnaCard qna={qna} href={`${basePath}/${qna.id}`} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
