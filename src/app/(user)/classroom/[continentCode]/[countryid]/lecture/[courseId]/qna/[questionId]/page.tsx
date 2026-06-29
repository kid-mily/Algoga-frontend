import { notFound } from "next/navigation";
import QnaDetailContent from "@/features/classroom/qna/components/QnaDetailContent";
import QnaLayout from "@/features/classroom/qna/components/QnaLayout";
import { getCourseQnaDetail } from "@/features/services/userQna.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface QnaDetailPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
    questionId: string;
  }>;
}

export default async function QnaDetailPage({
  params,
}: QnaDetailPageProps) {
  const { continentCode, countryid, courseId, questionId } = await params;

  const qna = await getCourseQnaDetail(courseId, questionId);

  if (!qna) {
    notFound();
  }

  return (
    <QnaLayout
      continentCode={continentCode}
      countryid={countryid}
      courseId={courseId}
      title="강의 Q&A"
      description="질문 내용과 답변을 확인해 보세요."
    >
      <QnaDetailContent
        qna={qna}
        courseId={courseId}
        qnaId={questionId}
      />
    </QnaLayout>
  );
}