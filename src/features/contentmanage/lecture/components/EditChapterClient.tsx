"use client";

import { useRouter } from "next/navigation";

import SubHeader from "@/features/contentmanage/common/SubHeader";
import ChapterForm from "@/features/contentmanage/lecture/components/ChapterForm";
import ChapterList from "@/features/contentmanage/lecture/components/ChapterList";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import AdminLoadingState from "@/features/common/AdminLoadingState";

import { updateChapterAction } from "../actions";
import { useAdminChapterDetail } from "../hooks/useAdminChapterDetail";

type EditChapterClientProps = {
  lectureId: number;
  chapterId: number;
};

export default function EditChapterClient({
  lectureId,
  chapterId,
}: EditChapterClientProps) {
  const router = useRouter();
  const { chapter, isLoading, error } = useAdminChapterDetail(
    lectureId,
    chapterId
  );

  const handleEdit = async (data: {
    title: string;
    description: string;
    duration: string;
    video: File | null;
  }) => {
    if (!chapter) return false;

    try {
      await updateChapterAction(lectureId, chapterId, {
        title: data.title,
        description: data.description,
        durationSeconds: Number(data.duration) || chapter.durationSeconds,
        chapterOrder: chapter.chapterOrder || 1,
        video: data.video,
      });

      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update chapter.";
      alert(message);
      return false;
    }
  };

  if (isLoading) {
    return <AdminLoadingState text="Loading chapter..." />;
  }

  if (error || !chapter) {
    return <AdminErrorBanner message={error || "Chapter not found."} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-10 py-10">
      <SubHeader
        backHref={`/contentadmin/lecture/${lectureId}/chapter/new`}
        backText="Back to chapters"
        title="Edit chapter"
        description="Update chapter information."
      />

      <ChapterList lectureId={lectureId} hideEdit />

      <ChapterForm
        mode="edit"
        initialChapter={{
          id: chapter.chapterId || (chapter as { id?: number }).id || 0,
          title: chapter.title,
          description: chapter.description || "",
          duration: String(chapter.durationSeconds || ""),
          video: null,
          preview: chapter.videoUrl || "",
        }}
        onSubmit={handleEdit}
        onClose={() =>
          router.push(`/contentadmin/lecture/${lectureId}/chapter/new`)
        }
      />
    </div>
  );
}
