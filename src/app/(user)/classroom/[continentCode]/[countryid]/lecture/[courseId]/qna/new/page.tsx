import type { Metadata } from "next";
import CourseQnaCreateClient from "@/features/classroom/qna/components/CourseQnaCreateClient";

interface CourseQnaCreatePageProps {
  params: {
    continentCode: string;
    countryid: string;
    courseId: string;
  };
}

export const metadata: Metadata = {
  title: "Q&A 질문 작성 | 알고가",
  description: "강의에 대한 새 질문을 작성합니다.",
};

export default function CourseQnaCreatePage({
  params,
}: CourseQnaCreatePageProps) {
  return (
    <CourseQnaCreateClient
      continentCode={decodeURIComponent(params.continentCode)}
      countryId={decodeURIComponent(params.countryid)}
      courseId={decodeURIComponent(params.courseId)}
    />
  );
}
