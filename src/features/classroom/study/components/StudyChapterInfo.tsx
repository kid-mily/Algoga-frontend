import type { CourseStudyChapter } from "../types";

interface Props {
  selectedChapter: CourseStudyChapter | null;
}

export default function StudyChapterInfo({ selectedChapter }: Props) {
  return (
    <article className="mx-auto mt-4 w-full max-w-[860px] rounded-2xl border border-[#E1E8EF] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(55,88,110,0.07)]">
      <p className="text-xs font-bold tracking-[0.16em] text-[#439A97]">
        CHAPTER NOTE
      </p>

      <h2 className="mt-2 text-base font-bold text-[#0A1628]">
        {selectedChapter
          ? `챕터 ${selectedChapter.chapterOrder}. ${selectedChapter.title}`
          : "챕터를 선택해 주세요"}
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#718096]">
        {selectedChapter?.description || "등록된 챕터 설명이 없습니다."}
      </p>
    </article>
  );
}