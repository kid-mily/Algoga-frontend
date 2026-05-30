'use client';

import { useRouter } from "next/navigation";

interface Props {
    continentCode: string;
    countryId: string;
}

export default function EvaluationBanner({continentCode, countryId,}: Props) {
    const router = useRouter();

    return (
        <div className="w-full bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#EEF5FF] rounded-2xl flex items-center justify-center text-xl">
                📝
                </div>

                <div>
                    <div className="font-bold text-[#0A1628] text-sm">
                        내 실력 확인하고 추천받기
                    </div>
                    <div className="text-xs text-[#8A94A6] mt-1">
                        진단 평가로 나에게 맞는 강의를 찾아보세요
                    </div>
                </div>
            </div>

            <button
                className="bg-[#439A97] text-white text-xs font-semibold px-5 py-4 rounded-2xl hover:bg-[#597777]"
                onClick={() =>
                router.push(`/classroom/${continentCode}/${countryId}/evaluation`)}
            >
                진단 평가 시작
            </button>
        </div>
    );
}