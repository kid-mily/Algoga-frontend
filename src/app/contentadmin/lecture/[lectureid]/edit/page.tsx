import EditLectureClient from "@/features/contentmanage/lecture/components/EditLectureClient";

type LectureEditPageProps = {
  params: Promise<{
    lectureid: string;
  }>;
};

export default async function LectureEditPage({ params }: LectureEditPageProps) {
  const { lectureid } = await params;

  return <EditLectureClient lectureId={Number(lectureid)} />;
}