import LectureCard from "./LectureCard";
import type { CourseItem } from "./types";

interface Props {
  lectures?: CourseItem[];
  continentCode: string;
  countryId: string;
}

export default function LectureGrid({
  lectures = [],
  continentCode,
  countryId,
}: Props) {
  if (lectures.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E3E8F0] bg-white p-10 text-center text-sm text-[#8A94A6]">
        등록된 강의가 없습니다.
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lectures.map((lecture, index) => (
        <li key={lecture.courseId} className="h-full">
          <LectureCard
            lecture={lecture}
            continentCode={continentCode}
            countryId={countryId}
            priority={index < 3}
          />
        </li>
      ))}
    </ul>
  );
}