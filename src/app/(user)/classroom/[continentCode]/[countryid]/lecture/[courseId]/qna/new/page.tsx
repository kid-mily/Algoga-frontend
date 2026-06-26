import QnaLayout from "@/features/classroom/qna/components/QnaLayout";
import QnaWriteForm from "@/features/classroom/qna/components/QnaWriteForm";

interface QnaWritePageProps {
  params: Promise<{
    continentCode: string;
    countryid: string;
    courseId: string;
  }>;
}

export default async function QnaWritePage({ params }: QnaWritePageProps) {
  const { continentCode, countryid, courseId } = await params;

  return (
    <QnaLayout
      continentCode={continentCode}
      countryid={countryid}
      courseId={courseId}
      title="질문하기"
      description="여행 강의와 관련된 궁금한 내용을 자유롭게 질문해 주세요."
    >
      <QnaWriteForm
        continentCode={continentCode}
        countryid={countryid}
        courseId={courseId}
      />
    </QnaLayout>
  );
}