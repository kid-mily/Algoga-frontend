"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLectureStudy } from "../hooks/useLectureStudy";
import StudySidebar from "./StudySidebar";
import StudyVideoPlayer from "./StudyVideoPlayer";
import StudyChapterInfo from "./StudyChapterInfo";


const getParam = (value: string | string[] | undefined) => {
    if (!value) return "";
    return decodeURIComponent(Array.isArray(value) ? value[0] : value);
    };

    export default function LectureStudyClient() {
    const params = useParams();

    const continentCode = getParam(params.continentCode);
    const countryId = getParam(params.countryid);
    const courseId = getParam(params.courseId);

    const study = useLectureStudy(courseId);

    if (study.isLoading) {
        return (
        <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB]">
            <p className="text-sm font-medium text-[#8A9BB0]">
            강의 정보를 불러오는 중입니다.
            </p>
        </main>
        );
    }

    if (study.errorMessage || !study.course) {
        return (
        <main className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4">
            <section className="rounded-[24px] bg-white p-8 text-center shadow-sm">
                <h1 className="text-lg font-bold text-[#0A1628]">
                    강의를 불러올 수 없습니다
                </h1>

                <p className="mt-2 text-sm text-red-500">{study.errorMessage}</p>

                <Link
                    href={`/classroom/${continentCode}/${countryId}/lecture/${courseId}`}
                    className="mt-5 inline-flex rounded-xl bg-[#5E9F9B] px-5 py-3 text-sm font-semibold text-white"
                >
                    강의 상세로 돌아가기
                </Link>
            </section>
        </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F7FB]">
            <div className="grid min-h-screen grid-cols-[340px_1fr]">
                <StudySidebar
                course={study.course}
                chapters={study.chapters}
                selectedChapter={study.selectedChapter}
                totalProgress={study.totalProgress}
                continentCode={continentCode}
                countryId={countryId}
                courseId={courseId}
                canOpenChapter={study.canOpenChapter}
                onChapterSelect={study.handleChapterSelect}
                />

                <section className="relative px-10 py-8">
                    <div className="mx-auto max-w-[1120px]">
                        <StudyVideoPlayer
                        videoRef={study.videoRef}
                        selectedChapter={study.selectedChapter}
                        isPlaying={study.isPlaying}
                        setIsPlaying={study.setIsPlaying}
                        reportProgress={study.reportProgress}
                        handleVideoEnded={study.handleVideoEnded}
                        />

                        <StudyChapterInfo selectedChapter={study.selectedChapter} />
                    </div>
                </section>
            </div>
        </main>
    );
}