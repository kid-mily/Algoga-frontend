import Image from "next/image";
import Link from "next/link";
import type { CourseItem } from "./types";

interface Props {
  lecture: CourseItem;
  continentCode: string;
  countryId: string;
  priority?: boolean;
}

const continentStyle: Record<
  string,
  {
    accent: string;
    soft: string;
    text: string;
  }
> = {
  ASIA: {
    accent: "bg-[#439A97]",
    soft: "bg-[#EEF8F7]",
    text: "text-[#357F7C]",
  },
  EUROPE: {
    accent: "bg-[#4F7FD9]",
    soft: "bg-[#F0F5FF]",
    text: "text-[#416AB8]",
  },
  NORTH_AMERICA: {
    accent: "bg-[#D6A640]",
    soft: "bg-[#FFF8E8]",
    text: "text-[#A87512]",
  },
  SOUTH_AMERICA: {
    accent: "bg-[#D96A5B]",
    soft: "bg-[#FFF1EF]",
    text: "text-[#BC4F43]",
  },
  AFRICA: {
    accent: "bg-[#C8843A]",
    soft: "bg-[#FFF4E8]",
    text: "text-[#A86425]",
  },
  OCEANIA: {
    accent: "bg-[#7C6FD6]",
    soft: "bg-[#F3F1FF]",
    text: "text-[#6558C8]",
  },
  ANTARCTICA: {
    accent: "bg-[#94A3B8]",
    soft: "bg-[#F1F5F9]",
    text: "text-[#64748B]",
  },
};

const getContinentStyle = (continentCode: string) =>
  continentStyle[continentCode.toUpperCase()] ?? {
    accent: "bg-[#94A3B8]",
    soft: "bg-[#F8FAFC]",
    text: "text-[#64748B]",
  };

const getLevelLabel = (levelText: string) => {
  if (levelText === "BEGINNER" || levelText === "초급") return "초급";
  if (levelText === "INTERMEDIATE" || levelText === "중급") return "중급";
  if (levelText === "ADVANCED" || levelText === "고급") return "고급";
  return levelText || "강의";
};

const getLevelBadgeClass = (levelText: string) => {
  const label = getLevelLabel(levelText);

  if (label === "초급") return "bg-[#EAF7F6] text-[#357A78]";
  if (label === "중급") return "bg-[#FFF4DF] text-[#A56B16]";
  if (label === "고급") return "bg-[#FDECEC] text-[#B54747]";

  return "bg-[#F8FAFC] text-[#64748B]";
};

export default function LectureCard({
  lecture,
  continentCode,
  countryId,
  priority = false,
}: Props) {
  const style = getContinentStyle(continentCode);
  const levelText = lecture.levelName || lecture.level;
  const levelLabel = getLevelLabel(levelText);
  const levelBadgeClass = getLevelBadgeClass(levelText);

  const href =
    `/classroom/${continentCode}/${countryId}/lecture/${lecture.courseId}`.toLowerCase();

  return (
    <Link
      href={href}
      className="group relative flex h-full min-h-[285px] flex-col overflow-hidden rounded-2xl border border-[#E1E8EF] bg-white shadow-[0_8px_24px_rgba(55,88,110,0.07)] transition hover:-translate-y-0.5 hover:border-[#B7DAD7] hover:shadow-[0_14px_34px_rgba(55,88,110,0.12)]"
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${style.accent}`} />

      <div className="relative h-[125px] shrink-0 overflow-hidden bg-[#EAF2F5]">
        {lecture.thumbnailUrl ? (
          <Image
            src={lecture.thumbnailUrl}
            alt={lecture.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            quality={70}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${style.soft}`}
          >
            <span className={`text-sm font-bold ${style.text}`}>
              CLASSROOM
            </span>
          </div>
        )}

        <span
          className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-extrabold shadow-sm ${levelBadgeClass}`}
        >
          {levelLabel}
        </span>
      </div>

      <article className="flex min-h-0 flex-1 flex-col px-5 py-4 pl-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[9px] font-bold tracking-[0.16em] text-[#A0AEC0]">
            COURSE
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-base font-extrabold leading-6 text-[#0A1628]">
          {lecture.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#718096]">
          {lecture.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-dashed border-[#D6E0E8] pt-3">
          <strong className={`text-sm font-extrabold ${style.text}`}>
            {lecture.price.toLocaleString()}원
          </strong>

          <span
            className={`text-xs font-semibold transition group-hover:translate-x-0.5 ${style.text}`}
          >
            자세히 보기
          </span>
        </div>
      </article>
    </Link>
  );
}