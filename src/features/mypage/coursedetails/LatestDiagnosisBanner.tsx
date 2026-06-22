import Link from "next/link";
import type { LatestDiagnosisResult } from "./types";

interface LatestDiagnosisBannerProps {
    diagnosis: LatestDiagnosisResult | null;
}

export default function LatestDiagnosisBanner({ diagnosis }: LatestDiagnosisBannerProps) {
    if (!diagnosis) {
        return (
        <section className="overflow-hidden rounded-lg border border-[#DCE9E7] bg-[#EFF7F6]">
            <div className="grid grid-cols-[1fr_180px] items-center">
            <div className="px-6 py-5">
                <p className="text-xs font-bold text-[#439A97]">
                나에게 맞는 여행 학습 찾기
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#0A1628]">
                아직 진단평가 결과가 없습니다
                </h2>

                <p className="mt-2 text-sm text-[#667085]">
                관심 국가의 진단평가를 통해 맞춤 강의를 추천받아 보세요.
                </p>
            </div>

            <div className="flex h-full items-center justify-center bg-[#DCEFED] text-5xl">
                ✈
            </div>
            </div>
        </section>
        );
    }

    return (
        <section className="overflow-hidden rounded-lg border border-[#DCE9E7] bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_180px]">
                <div className="px-6 py-5">
                <p className="text-xs font-bold text-[#439A97]">
                    최신 여행 학습 진단
                </p>

                <div className="mt-1 flex items-center gap-3">
                    <h2 className="text-lg font-bold text-[#0A1628]">
                    {diagnosis.levelName}
                    </h2>

                    <span className="rounded-full bg-[#EAF7F6] px-3 py-1 text-xs font-bold text-[#357A78]">
                    {diagnosis.score}점
                    </span>
                </div>

                <p className="mt-2 text-sm text-[#667085]">
                    {diagnosis.totalCount}문제 중{" "}
                    {diagnosis.correctCount}문제를 맞혔습니다.
                </p>
                </div>

                <div className="flex flex-col items-center justify-center bg-[#EFF7F6]">
                <span className="text-4xl">
                    🧭
                </span>

                <strong className="mt-2 text-2xl text-[#439A97]">
                    {diagnosis.score}
                </strong>

                <span className="text-xs text-[#8A9BB0]">
                    진단 점수
                </span>
                </div>
            </div>
        </section>
    );
}