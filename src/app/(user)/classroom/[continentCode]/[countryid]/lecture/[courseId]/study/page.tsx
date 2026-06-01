'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LectureSideBar from "@/features/classroom/components/LectureSideBar";
import {
    ChapterItem,
    VideoItem,
    CourseItem
} from "@/features/classroom/components/types";

export default function LectureStudyPage() {
    const params = useParams();

    const continentCode = params.continentCode;
    const countryId = params.countryId;
    const courseId = params.courseId;

    const [courseMeta, setCourseMeta] = useState<CourseItem | null>(null);
    const [chapters, setChapters] = useState<ChapterItem[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const mockCourse: CourseItem = {
            courseId: 53,
            countryId: 1,
            title: "일본 여행 회화",
            description: "여행 전 꼭 알아야 할 일본어 회화",
            price: 74000,
            thumbnailUrl: "",
            fileUrls: [],
            level: "BEGINNER",
            levelName: "초급",
            status: "ACTIVE",
        };

        const mockChapters: ChapterItem[] = [
            {
                chapterId: 1,
                chapterTitle: "기본 인사",
                chapterNumber: "01장",
                progressRate: 0,
                completed: false,
                videos: [
                    {
                        videoId: 1,
                        chapterId: 1,
                        title: "안녕하세요",
                        videoUrl: "",
                        description:
                            "일본 여행에서 가장 많이 사용하는 기본 인사 표현을 학습합니다.",
                        duration: "05:20",
                        uploadDate: "2026-05-01",
                    },
                ],
            },
            {
                chapterId: 2,
                chapterTitle: "식당 회화",
                chapterNumber: "02장",
                progressRate: 0,
                completed: false,
                videos: [
                    {
                        videoId: 2,
                        chapterId: 2,
                        title: "주문하기",
                        videoUrl: "",
                        description:
                            "일본 식당에서 자연스럽게 주문하는 표현을 학습합니다.",
                        duration: "08:10",
                        uploadDate: "2026-05-01",
                    },
                ],
            },
            {
                chapterId: 3,
                chapterTitle: "길 묻기",
                chapterNumber: "03장",
                progressRate: 0,
                completed: false,
                videos: [
                    {
                        videoId: 3,
                        chapterId: 3,
                        title: "역 찾기",
                        videoUrl: "",
                        description:
                            "길을 물어보고 안내받는 표현을 학습합니다.",
                        duration: "07:30",
                        uploadDate: "2026-05-01",
                    },
                ],
            },
        ];

        setCourseMeta(mockCourse);
        setChapters(mockChapters);
        setSelectedVideo(mockChapters[0].videos[0]);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center text-sm text-gray-500">
                강의 대시보드를 로딩 중입니다...
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#f5f6f8] grid grid-cols-[320px_1fr]">

            <LectureSideBar
                chapters={chapters}
                currentVideoId={selectedVideo?.videoId}
                courseTitle={courseMeta?.title || "강의실"}
                courseDescription={courseMeta?.description}
                onVideoSelect={(nextVideo: VideoItem) => {
                    setSelectedVideo(nextVideo);
                }}
            />

            <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-screen">

                <div className="w-full aspect-video bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200">

                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">

                        <p className="text-4xl font-black text-[#0A1628]">
                            {selectedVideo?.title}
                        </p>

                        <p className="text-[#8A9BB0] mt-3">
                            API 연동 전 시연용 강의 화면입니다.
                        </p>

                    </div>

                </div>

                <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm">

                    <div>

                        <h2 className="text-xl font-black mt-2 text-[#0A1628]">
                            {selectedVideo?.title || "상세 챕터를 선택해 주세요."}
                        </h2>

                        <p className="text-xs text-gray-400 mt-2">
                            업로드 타임라인 : {selectedVideo?.uploadDate}
                        </p>

                    </div>

                    <hr className="border-gray-100 mt-5 mb-5" />

                    <div className="text-sm text-[#0A1628] leading-relaxed space-y-2">

                        <p className="font-bold text-[#0A1628]">
                            📂 단원 핵심 시놉시스
                        </p>

                        <p className="text-[#8A9BB0]">
                            {selectedVideo?.description}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}