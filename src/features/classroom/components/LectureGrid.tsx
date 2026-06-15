import LectureCard from "./LectureCard";
import { CourseItem } from "./types";

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
      <p className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500">
        등록된 강의가 없습니다.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-3 gap-5">
      {lectures.map((lecture) => (
        <li key={lecture.courseId}>
          <LectureCard
            lecture={lecture}
            continentCode={continentCode}
            countryId={countryId}
          />
        </li>
      ))}
    </ul>
  );
}