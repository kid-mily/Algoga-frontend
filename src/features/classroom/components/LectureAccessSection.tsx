"use client";

import { useLectureAccess } from "@/features/classroom/hooks/useLectureAccess";
import LectureActionCard from "./LectureActionCard";
import LectureAttachments from "./LectureAttachments";
import type { CourseFile, CourseItem } from "./types";

interface LectureAccessSectionProps {
  course: CourseItem & {
    isPaid?: boolean;
    purchased?: boolean;
    paid?: boolean;
    enrolled?: boolean;
  };
  continentCode: string;
  countryId: string;
  courseId: string;
  fileUrls: string[];
  files?: CourseFile[];
}

export default function LectureAccessSection({
  course,
  continentCode,
  countryId,
  courseId,
  fileUrls,
  files,
}: LectureAccessSectionProps) {
  const fallbackCanStudy = Boolean(
    course.isPaid ?? course.purchased ?? course.paid
  );

  const { isCheckingAccess, requiresLogin, canStudy } = useLectureAccess({
    courseId,
    fallbackCanStudy,
  });

  return (
    <>
      <LectureActionCard
        course={course}
        continentCode={continentCode}
        countryId={countryId}
        courseId={courseId}
        isCheckingAccess={isCheckingAccess}
        requiresLogin={requiresLogin}
        canStudy={canStudy}
      />

      <LectureAttachments
        fileUrls={fileUrls}
        files={files}
        isCheckingAccess={isCheckingAccess}
        canViewAttachments={canStudy}
      />
    </>
  );
}
