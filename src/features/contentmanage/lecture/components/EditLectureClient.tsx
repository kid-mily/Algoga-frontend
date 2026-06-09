"use client";

import LectureHeader from "@/features/contentmanage/common/LectureHeader";
import LectureUpdateForm from "@/features/contentmanage/lecture/components/LectureUpdateForm";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import AdminLoadingState from "@/features/common/AdminLoadingState";

import { updateLectureAction } from "../actions";
import { useAdminLectureDetail } from "../hooks/useAdminLectureDetail";
import { getIsPublic } from "../utils/lectureFormatters";

type EditLectureClientProps = {
  lectureId: number;
};

export default function EditLectureClient({
  lectureId,
}: EditLectureClientProps) {
  const { lecture, isLoading, error } = useAdminLectureDetail(lectureId);

  const handleEdit = async (
    data: any,
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
        level: lecture.level || "BEGINNER",
        status: targetStatus,
        thumbnail: thumbnailFile,
        files: attachments,
      });

      return true;
    } catch (error: any) {
      alert(error.message || "강의 수정에 실패했습니다.");
      return false;
    }
  };

  if (isLoading) {
    return <AdminLoadingState text="강의 정보를 불러오는 중입니다..." />;
  }

  if (error || !lecture) {
    return <AdminErrorBanner message={error || "강의 정보를 찾을 수 없습니다."} />;
  }

  return (
    <div className="p-6">
      <LectureHeader
        title="강의 수정"
        description="여행 강의를 수정하고 관리합니다"
      />

      <div className="mt-6">
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
      </div>
    </div>
  );
}
