"use client";

import { useRouter } from "next/navigation";

import SubHeader from "@/features/contentmanage/common/SubHeader";
import ChapterForm from "@/features/contentmanage/lecture/components/ChapterForm";
import ChapterList from "@/features/contentmanage/lecture/components/ChapterList";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import AdminLoadingState from "@/features/common/AdminLoadingState";

import { updateChapterAction } from "../actions";
import { useAdminChapterDetail } from "../hooks/useAdminChapterDetail";
import { ChapterSubmitPayload, EditChapterClientProps } from "../types";

export default function EditChapterClient({
  lectureId,
  chapterId,
}: EditChapterClientProps) {
  const router = useRouter();
  const { chapter, isLoading, error } = useAdminChapterDetail(
    lectureId,
    chapterId
  );

  const handleEdit = async (data: ChapterSubmitPayload) => {
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
        error instanceof Error ? error.message : "챕터 수정에 실패했습니다.";
      alert(message);
      return false;
    }
  };

  if (isLoading) {
    return <AdminLoadingState text="챕터를 불러오는 중..." />;
  }

  if (error || !chapter) {
    return <AdminErrorBanner message={error || "챕터를 찾을 수 없습니다."} />;
  }

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-10 py-10" aria-labelledby="edit-chapter-title">
      <section aria-labelledby="edit-chapter-title">
        <SubHeader
          backHref={`/contentadmin/lecture/${lectureId}/chapter/new`}
          backText="챕터 목록으로"
          title="챕터 수정"
          description="챕터 정보를 수정합니다."
        />
      </section>

      <ChapterList lectureId={lectureId} hideEdit />

      <section aria-label="챕터 수정 폼">
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
      </section>
    </main>
  );
}
