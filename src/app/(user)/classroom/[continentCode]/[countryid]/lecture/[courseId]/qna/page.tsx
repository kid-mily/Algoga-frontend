import QnaLayout from "@/features/classroom/qna/components/QnaLayout";
import QnaListContent from "@/features/classroom/qna/components/QnaListContent";
import { getCourseQnas } from "@/features/services/userQna.service";


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
      description="여행 강의를 들으며 궁금한 점을 질문하고 답변을 확인하세요."
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