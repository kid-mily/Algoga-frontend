"use client";

import { useParams } from "next/navigation";

import LectureUpdateForm from "@/features/contentmanage/LectureUpdateForm";
import { lectures } from "@/features/contentmanage/MockData";
import LectureHeader from "@/features/contentmanage/LectureHeader";

export default function LectureEditPage() {

  const params = useParams();

  const lectureId = Number(
    params.lectureid
  );

  // 강의 찾기
  const lecture = lectures.find(
    (item) => item.id === lectureId
  );

  // 강의 없을 때
  if (!lecture) {

    return (
      <div className="p-10">
        강의를 찾을 수 없습니다.
      </div>
    );
  }

  // 수정 submit
  const handleEdit = (
    data: any
  ) => {

    console.log(
      "수정 데이터",
      data
    );
  };
  return (
    <div className="p-6">
     <LectureHeader
            title="강의 수정"
            description="여행 강의를 수정하고 관리합니다"
        />
        <div className="mt-6">
        <LectureUpdateForm
          initialData={{
            country: lecture.country,
            title: lecture.title,
            description:lecture.description,
            price: lecture.price,
            mileage:lecture.mileage,
          }}
        onSubmit={handleEdit}
      />          
        </div>

    </div>
  );
}