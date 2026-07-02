"use client";

import { useRouter } from "next/navigation";

interface Props {
    continentCode: string;
    countryId: string;
}

export default function EvaluationBanner({ continentCode, countryId }: Props) {
    const router = useRouter();
    const pathContinentCode = continentCode.trim().toLowerCase();

    return (
        <div className="mb-8 flex w-full items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF5FF] text-xl">
                🧭
                </div>

                <div>
                    <div className="text-sm font-bold text-[#0A1628]">
                        실력 확인하고 추천받기
                    </div>
                    <div className="mt-1 text-xs text-[#8A94A6]">
                        진단 평가로 나에게 맞는 강의를 찾아보세요.
                    </div>
                </div>
            </div>

            <button
                type="button"
                className="rounded-2xl bg-[#439A97] px-5 py-4 text-xs font-semibold text-white hover:bg-[#597777]"
                onClick={() =>
                router.push(`/classroom/${pathContinentCode}/${countryId}/evaluation`)
                }
            >
                진단 평가 시작
            </button>
        </div>
    );
}