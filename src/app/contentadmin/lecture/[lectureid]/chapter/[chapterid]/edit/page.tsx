import EditChapterClient from "@/features/contentmanage/lecture/components/EditChapterClient";

type EditChapterPageProps = {
  params: Promise<{
    lectureid: string;
    chapterid: string;
  }>;
};

export default async function EditChapterPage({ params }: EditChapterPageProps) {
  const { lectureid, chapterid } = await params;

  return (
    <EditChapterClient
      lectureId={Number(lectureid)}
      chapterId={Number(chapterid)}
    />
  );
}