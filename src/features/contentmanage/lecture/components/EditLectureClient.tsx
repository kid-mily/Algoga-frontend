"use client";

import LectureHeader from "@/features/common/components/LectureHeader";
import LectureUpdateForm from "@/features/contentmanage/lecture/components/LectureUpdateForm";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import AdminLoadingState from "@/features/admin/common/AdminLoadingState";
import { getErrorMessage } from "@/features/common/utils/getErrorMessage";
import { toNumberOrZero } from "@/features/common/utils/number";
import { updateLectureAction } from "../actions";
import { useAdminLectureDetail } from "../hooks/useAdminLectureDetail";
import { getIsPublic, getLectureCountryId } from "../utils/lectureFormatters";
import { EditLectureClientProps, EditLecturePayload } from "../types";

export default function EditLectureClient({
  lectureId,
}: EditLectureClientProps) {
  const { lecture, countries, isLoading, error } = useAdminLectureDetail(lectureId);

  const handleEdit = async (
    data: EditLecturePayload,
    thumbnailFile?: File,
    attachments?: File[]
  ) => {
    if (!lecture) return false;

    try {
      const isPublicBool = String(data.isPublic) === "true";
      const targetStatus = data.status || (isPublicBool ? "PUBLISHED" : "DRAFT");
      const maxRewardMileage = toNumberOrZero(data.mileage);

      await updateLectureAction(lectureId, {
        countryId: getLectureCountryId(lecture),
        title: data.title,
        description: data.description,
        price: Number(data.price),
        mileage: maxRewardMileage,
        maxRewardMileage,
        level: data.level || lecture.level || "BEGINNER",
        status: targetStatus,
        thumbnail: thumbnailFile,
        files: attachments,
      });

      return true;
    } catch (error: unknown) {
      alert(getErrorMessage(error, "강의 수정에 실패했습니다."));
      return false;
    }
  };

  if (isLoading) {
    return <AdminLoadingState text="강의를 불러오는 중입니다." />;
  }

  if (error || !lecture) {
    return (
      <AdminErrorBanner message={error || "강의를 찾을 수 없습니다."} />
    );
  }

  const countryId = getLectureCountryId(lecture);
  const countryName =
    lecture.countryName ||
    lecture.country_name ||
    countries.find((country) => country.countryId === countryId)?.countryName ||
    "";

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
            country: countryName,
            title: lecture.title || "",
            description: lecture.description || "",
            price: String(lecture.price || ""),
            mileage: String(lecture.maxRewardMileage ?? ""),
            level: lecture.level || "BEGINNER",
            isPublic: getIsPublic(lecture) ? "true" : "false",
            thumbnailUrl: lecture.thumbnailUrl || lecture.thumbnail_url || null,
            files: lecture.files ?? [],
          }}
          onSubmit={handleEdit}
        />
      </section>
    </main>
  );
}
