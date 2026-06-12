import type { Metadata } from "next";
import CourseQnaListClient from "@/features/classroom/qna/components/CourseQnaListClient";

interface CourseQnaPageProps {
  params: {
    continentCode: string;
    countryid: string;
    courseId: string;
  };
}

export const metadata: Metadata = {
  title: "강의 Q&A | 알고가",
  description: "강의에 대한 질문과 답변을 확인합니다.",
};

export default function CourseQnaPage({ params }: CourseQnaPageProps) {
  return (
    <CourseQnaListClient
      continentCode={decodeURIComponent(params.continentCode)}
      countryId={decodeURIComponent(params.countryid)}
      courseId={decodeURIComponent(params.courseId)}
    />
  );
}
