import { CourseStudyChapter } from "../types";

interface Props {
    selectedChapter: CourseStudyChapter | null;
}

export default function StudyChapterInfo({ selectedChapter }: Props) {
    return (
        <article className="mt-3 bg-white px-5 py-4 shadow-sm">
            <h2 className="text-base font-bold text-[#0A1628]">
                {selectedChapter
                ? `챕터 ${selectedChapter.chapterOrder}. ${selectedChapter.title}`
                : "챕터를 선택해 주세요."}
            </h2>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#8A9BB0]">
                {selectedChapter?.description ||
                "등록된 챕터 설명이 없습니다."}
            </p>
        </article>
    );
}