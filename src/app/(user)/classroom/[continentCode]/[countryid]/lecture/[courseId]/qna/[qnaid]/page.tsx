import type { Metadata } from "next";
import CourseQnaDetailClient from "@/features/classroom/qna/components/CourseQnaDetailClient";

interface CourseQnaDetailPageProps {
  params: {
    continentCode: string;
    countryid: string;
    courseId: string;
    qnaid: string;
  };
}

export const metadata: Metadata = {
  title: "Q&A 상세 | 알고가",
  description: "강의 Q&A 상세 내용과 댓글을 확인합니다.",
};

export default function CourseQnaDetailPage({
  params,
}: CourseQnaDetailPageProps) {
  return (
    <CourseQnaDetailClient
      continentCode={decodeURIComponent(params.continentCode)}
      countryId={decodeURIComponent(params.countryid)}
      courseId={decodeURIComponent(params.courseId)}
      qnaId={decodeURIComponent(params.qnaid)}
    />
  );
}
