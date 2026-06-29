import QnaLayout from "@/features/classroom/qna/components/QnaLayout";
import QnaListContent from "@/features/classroom/qna/components/QnaListContent";
import { getCourseQnas } from "@/features/services/userQna.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface QnaPageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
  }>;
}

export default async function QnaPage({ params }: QnaPageProps) {
  const { continentCode, countryid, courseId } = await params;
  const qnas = await getCourseQnas(courseId);

  return (
    <QnaLayout
      continentCode={continentCode}
      countryid={countryid}
      courseId={courseId}
      title="강의 Q&A"
      description="강의를 들으며 궁금했던 점을 질문하고 답변을 확인해 보세요."
    >
      <QnaListContent
        qnas={qnas}
        continentCode={continentCode}
        countryid={countryid}
        courseId={courseId}
      />
    </QnaLayout>
  );
}