"use client";

import LectureHeader from "@/features/contentmanage/common/LectureHeader";
import LectureUpdateForm from "@/features/contentmanage/lecture/components/LectureUpdateForm";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import AdminLoadingState from "@/features/common/AdminLoadingState";

import { updateLectureAction } from "../actions";
import { useAdminLectureDetail } from "../hooks/useAdminLectureDetail";
import { getIsPublic } from "../utils/lectureFormatters";
import { EditLectureClientProps, EditLecturePayload } from "../types";

export default function EditLectureClient({
  lectureId,
}: EditLectureClientProps) {
  const { lecture, isLoading, error } = useAdminLectureDetail(lectureId);

  const handleEdit = async (
    data: EditLecturePayload,
    thumbnailFile?: File,
    attachments?: File[]
  ) => {
    if (!lecture) return false;

    try {
      const isPublicBool = String(data.isPublic) === "true";
      const targetStatus = data.status || (isPublicBool ? "PUBLISHED" : "DRAFT");

      await updateLectureAction(lectureId, {
        countryId: lecture.countryId,
        title: data.title,
        description: data.description,
        price: Number(data.price),
        mileage: Number(data.mileage || 0),
        level: lecture.level || "BEGINNER",
        status: targetStatus,
        thumbnail: thumbnailFile,
        files: attachments,
      });

      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "강의 수정에 실패했습니다.";
      alert(message);
      return false;
    }
  };

  if (isLoading) {
    return <AdminLoadingState text="강의를 불러오는 중..." />;
  }

  if (error || !lecture) {
    return <AdminErrorBanner message={error || "강의를 찾을 수 없습니다."} />;
  }

  return (
    <main className="p-6" aria-labelledby="edit-lecture-title">
      <section aria-labelledby="edit-lecture-title">
        <LectureHeader
          title="강의 수정"
          description="강의 콘텐츠와 설정을 수정합니다."
        />
      </section>

      <section className="mt-6" aria-label="강의 수정 폼">
        <LectureUpdateForm
          initialData={{
            country: lecture.countryName || String(lecture.countryId || ""),
            title: lecture.title || "",
            description: lecture.description || "",
            price: String(lecture.price || ""),
            mileage: String(lecture.mileage || ""),
            isPublic: getIsPublic(lecture) ? "true" : "false",
          }}
          onSubmit={handleEdit}
        />
      </section>
    </main>
  );
}
