import CreateChapterClient from "@/features/contentmanage/lecture/components/CreateChapterClient";

type NewChapterPageProps = {
  params: Promise<{
    lectureid: string;
  }>;
};

export default async function NewChapterPage({ params }: NewChapterPageProps) {
  const { lectureid } = await params;

  return <CreateChapterClient lectureId={Number(lectureid)} />;
}