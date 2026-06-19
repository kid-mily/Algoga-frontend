import { RefObject } from "react";
import { ChapterProgress, CourseStudyChapter } from "../types";

interface Props {
    videoRef: RefObject<HTMLVideoElement | null>;
    selectedChapter: CourseStudyChapter | null;
    isPlaying: boolean;
    setIsPlaying: (value: boolean) => void;
    reportProgress: (
        watchedSeconds: number,
        force?: boolean
    ) => Promise<ChapterProgress | null>;
    handleVideoEnded: (currentTime: number) => void;
}

export default function StudyVideoPlayer({
    videoRef,
    selectedChapter,
    isPlaying,
    setIsPlaying,
    reportProgress,
    handleVideoEnded,
}: Props) {
    return (
        <article className="overflow-hidden rounded-[24px] border border-[#6D9F9B] bg-black shadow-sm">
            <div className="relative aspect-video w-full bg-black">
                {selectedChapter?.videoUrl ? (
                <>
                    <video
                    ref={videoRef}
                    key={selectedChapter.chapterId}
                    src={selectedChapter.videoUrl}
                    controls
                    className="h-full w-full object-cover"
                    onPlay={() => setIsPlaying(true)}
                    onPause={(event) => {
                        setIsPlaying(false);
                        reportProgress(event.currentTarget.currentTime, true);
                    }}
                    onTimeUpdate={(event) =>
                        reportProgress(event.currentTarget.currentTime)
                    }
                    onEnded={(event) =>
                        handleVideoEnded(event.currentTarget.currentTime)
                    }
                    />

                    <div className="pointer-events-none absolute left-7 top-6 rounded-full bg-[#315E62]/80 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                    챕터 {selectedChapter.chapterOrder}. {selectedChapter.title}
                    </div>

                    {!isPlaying && (
                    <button
                        type="button"
                        aria-label="영상 재생"
                        onClick={() => videoRef.current?.play()}
                        className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#6D9F9B]/80 text-white shadow-lg backdrop-blur transition hover:bg-[#5E908D]"
                    >
                        <span className="ml-1 text-4xl leading-none">▶</span>
                    </button>
                    )}
                </>
                ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#E9EEF5]">
                    <p className="text-sm font-medium text-[#8A9BB0]">
                    재생할 영상이 없습니다.
                    </p>
                </div>
                )}
            </div>
        </article>
    );
}