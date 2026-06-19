import { CourseStudyChapter } from "../types";

interface Props {
    selectedChapter: CourseStudyChapter | null;
}

export default function StudyChapterInfo({ selectedChapter }: Props) {
    return (
        <article className="mt-7 rounded-[22px] bg-white px-7 py-6 shadow-sm">
        <p className="text-xl font-bold text-[#0A1628]">
            {selectedChapter
            ? `챕터 ${selectedChapter.chapterOrder}. ${selectedChapter.title}`
            : "챕터를 선택해 주세요"}
        </p>

        <p className="mt-3 text-[15px] leading-8 text-[#8A9BB0]">
            {selectedChapter?.description ||
            "이 챕터의 설명이 아직 등록되지 않았습니다."}
        </p>
        </article>
    );
}