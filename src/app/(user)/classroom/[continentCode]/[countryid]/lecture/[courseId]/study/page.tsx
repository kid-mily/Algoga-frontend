'use client';

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import LectureSideBar from "@/features/classroom/components/LectureSideBar";
import { updateChapterProgress } from "@/features/services/lectureDetail.service";
import { api } from "@/lib/api"; 
import { BaseApiResponse, ChapterItem, VideoItem, CourseItem } from "@/features/classroom/components/types";

export default function LectureStudyPage() {
    const params = useParams();
    const router = useRouter();

    const continentCode = params.continentCode;
    const countryId = params.countryid; 
    const courseId = params.courseId;

    // API 연동 데이터 상태 관리
    const [courseMeta, setCourseMeta] = useState<CourseItem | null>(null);
    const [chapters, setChapters] = useState<ChapterItem[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 실시간 비디오 및 전송 누적 타이머 핸들러
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!courseId) return;

        const fetchStudyData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const metaEndpoint = `/api/v1/courses/countries/${countryId}`;
                const curriculumEndpoint = `/api/v1/courses/${courseId}/curriculum`;

                const [metaRes, curriculumRes] = await Promise.all([
                    api.get<BaseApiResponse<CourseItem[]>>(metaEndpoint),
                    api.get<BaseApiResponse<ChapterItem[]>>(curriculumEndpoint)
                ]);

                // 코스 정보
                const matchedCourse = (metaRes.data?.data || []).find(c => String(c.courseId) === String(courseId));
                if (matchedCourse) setCourseMeta(matchedCourse);

                // 커리큘럼 매핑 및 비디오별 상위 chapterId
                const rawCurriculum = curriculumRes.data?.data || [];
                const normalizedCurriculum = rawCurriculum.map(ch => ({
                    ...ch,
                    videos: (ch.videos || []).map(v => ({ ...v, chapterId: ch.chapterId }))
                }));

                setChapters(normalizedCurriculum);
                
                // 초기 진입 시 자동 재생할 비디오 (첫 챕터의 첫 영상)
                if (normalizedCurriculum.length > 0 && normalizedCurriculum[0].videos?.length > 0) {
                    setSelectedVideo(normalizedCurriculum[0].videos[0]);
                }
            } catch (err: any) {
                console.error("강의실 데이터 초기화 실패:", err);
                setError(err?.response?.data?.message || "강의 정보를 불러오는 중 서버에서 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudyData();
    }, [courseId, countryId]);

    const syncWatchedProgress = async (currentTimeInSeconds: number, targetChapterId?: number) => {
        const chapterId = targetChapterId || selectedVideo?.chapterId;
        if (!courseId || !chapterId || currentTimeInSeconds <= 0) return;

        try {
            const currentCourseId = Array.isArray(courseId) ? courseId[0] : courseId;
            const updatedResponse = await updateChapterProgress(currentCourseId, chapterId, currentTimeInSeconds);
            
            if (updatedResponse) {
                setChapters(prevChapters => 
                    prevChapters.map(ch => ch.chapterId === chapterId 
                        ? { ...ch, progressRate: updatedResponse.progressRate, completed: updatedResponse.completed }
                        : ch
                    )
                );
            }
        } catch (err) {
            console.error("진도율 데이터 전송 에러 캐치:", err);
        }
    };

    const onPlayTrigger = () => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        
        // 유저 시청 흐름 유실 방지를 위해 5초마다 자동 누적 POST 트래킹 실행
        progressIntervalRef.current = setInterval(() => {
            if (videoRef.current) {
                syncWatchedProgress(videoRef.current.currentTime);
            }
        }, 5000);
    };

    const onPauseOrEndTrigger = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        if (videoRef.current) {
            syncWatchedProgress(videoRef.current.currentTime);
        }
    };

    // 영상 전환
    useEffect(() => {
        return () => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, [selectedVideo]);

    if (isLoading) return <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center text-sm text-gray-500">강의 대시보드를 로딩 중입니다...</div>;
    if (error) return <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="w-full min-h-screen bg-[#f5f6f8] grid grid-cols-[320px_1fr]">
            {/* 사이드바 */}
            <LectureSideBar 
                chapters={chapters} 
                currentVideoId={selectedVideo?.videoId}
                courseTitle={courseMeta?.title || "강의실"}
                courseDescription={courseMeta?.description}
                onVideoSelect={(nextVideo: VideoItem) => {
                    // 다음 영상으로 클릭 전환하기 직전, 현재까지 본 기존 챕터 시청 기록 최종 정산 저장 유도
                    if (videoRef.current && selectedVideo) {
                        syncWatchedProgress(videoRef.current.currentTime, selectedVideo.chapterId);
                    }
                    setSelectedVideo(nextVideo);
                }}
            />
            
            {/* 우측 비디오 & 챕터 */}
            <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-screen"> 
                {/* 비디오*/}
                <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-sm border border-gray-200">
                    {selectedVideo?.videoUrl ? (
                        <video 
                            ref={videoRef}
                            src={selectedVideo.videoUrl} 
                            controls 
                            className="w-full h-full"
                            key={selectedVideo.videoId} // Key 변경 방식을 통해 HTML5 플레이어 자원 깔끔하게 교체 초기화
                            onPlay={onPlayTrigger}
                            onPause={onPauseOrEndTrigger}
                            onEnded={onPauseOrEndTrigger}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            재생할 수 있는 동영상 파일 스트림이 명세에 존재하지 않습니다.
                        </div>
                    )}
                </div>

                {/* 📝 강의 상세  */}
                <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-sm">
                    <div>
                        <h2 className="text-xl font-black mt-2 text-[#0A1628]">
                            {selectedVideo?.title || "상세 챕터를 선택해 주세요."}
                        </h2>
                        <p className="text-xs text-gray-400 mt-2">
                            업로드 타임라인: {selectedVideo?.uploadDate || "2026년 5월"}
                        </p>
                    </div>
                    <hr className="border-gray-100 mt-5 mb-5"/>
                    <div className="text-sm text-[#0A1628] leading-relaxed space-y-2">
                        <p className="font-bold text-[#0A1628]">📂 단원 핵심 시놉시스</p>
                        <p className="text-[#8A9BB0]">
                            {selectedVideo?.description || "이 비디오에 등록된 학습 요약 스크립트 텍스트가 없습니다."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}