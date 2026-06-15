// 강의

import Link from "next/link";
import { CourseItem, LEVEL_COLORS } from "./types";

interface Props {
  lecture: CourseItem;
  continentCode: string;
  countryId: string;
}

export default function LectureCard({
  lecture,
  continentCode,
  countryId,
}: Props) {
  const levelText = lecture.levelName || lecture.level;
  const levelClass = LEVEL_COLORS[levelText] || "bg-gray-500";

  return (
    <Link
      href={`/classroom/${continentCode}/${countryId}/lecture/${lecture.courseId}`}
      className="block overflow-hidden rounded-3xl border bg-white transition hover:shadow-md"
    >
      <img
        src={lecture.thumbnailUrl}
        alt={lecture.title}
        className="h-30 w-full object-cover"
      />

      <article className="p-5">
        <span className={`rounded px-2 py-1 text-xs text-white ${levelClass}`}>
          {levelText}
        </span>

        <h3 className="mt-3 font-bold text-[#0A1628]">{lecture.title}</h3>

        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {lecture.description}
        </p>

        <p className="mt-4 font-bold text-[#439A97]">
          {lecture.price.toLocaleString()}원
        </p>
      </article>
    </Link>
  );
}