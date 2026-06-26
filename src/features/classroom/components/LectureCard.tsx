import Link from "next/link";
import { CourseItem } from "./types";

interface Props {
  lecture: CourseItem;
  continentCode: string;
  countryId: string;
}

const getLevelBadgeClass = (levelText: string) => {
  if (levelText === "초급" || levelText === "BEGINNER") {
    return "bg-[#EAF7F6] text-[#357A78]";
  }

  if (levelText === "중급" || levelText === "INTERMEDIATE") {
    return "bg-[#FFF4DF] text-[#A56B16]";
  }

  if (levelText === "고급" || levelText === "ADVANCED") {
    return "bg-[#FDECEC] text-[#B54747]";
  }

  return "bg-white text-[#357A78]";
};

export default function LectureCard({
  lecture,
  continentCode,
  countryId,
}: Props) {
  const levelText = lecture.levelName || lecture.level;
  const levelBadgeClass = getLevelBadgeClass(levelText);

  return (
    <Link
      href={`/classroom/${continentCode}/${countryId}/lecture/${lecture.courseId}`}
      className="flex h-[300px] flex-col overflow-hidden rounded-[26px] border border-[#E1EAF0] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-[132px] shrink-0 overflow-hidden bg-[#EAF2F5]">
        <img
          src={lecture.thumbnailUrl}
          alt={lecture.title}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold shadow-sm ${levelBadgeClass}`}
        >
          {levelText}
        </span>
      </div>

      <article className="flex min-h-0 flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[42px] text-sm font-extrabold leading-[21px] text-[#0A1628]">
          {lecture.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[38px] text-xs leading-[19px] text-[#8A9BB0]">
          {lecture.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-[#EEF2F6] pt-3">
          <strong className="text-sm font-extrabold text-[#439A97]">
            {lecture.price.toLocaleString()}원
          </strong>

          <span className="text-[11px] font-bold text-[#98A2B3]">
            자세히 보기
          </span>
        </div>
      </article>
    </Link>
  );
}