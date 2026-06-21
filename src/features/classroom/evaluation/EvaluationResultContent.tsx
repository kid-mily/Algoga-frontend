"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
    DIAGNOSIS_RESULT_STORAGE_KEY,
    DiagnosisLevel,
    DiagnosisRecommendedCourse,
    DiagnosisResult,
} from "./types";
import { getDiagnosisRecommendations } from "@/features/services/evaluation.service";

interface EvaluationResultContentProps {
    continentCode: string;
    countryId: string;
    fallbackLevel?: DiagnosisLevel;
}

const formatPrice = (price: number) => {
  return `${price.toLocaleString("ko-KR")}원`;
};

export default function EvaluationResultContent({
    continentCode,
    countryId,
    fallbackLevel,
}: EvaluationResultContentProps) {
    // 진단평가 결과
    const [result, setResult] = useState<DiagnosisResult | null>(null);

    // 추천 강의 목록
    const [recommendedCourses, setRecommendedCourses] = useState<DiagnosisRecommendedCourse[]>([]);

    // 결과 데이터를 불러오는 중인지 확인
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedResult = sessionStorage.getItem(DIAGNOSIS_RESULT_STORAGE_KEY);

        if (storedResult) {
            const parsedResult = JSON.parse(storedResult) as DiagnosisResult;

            setResult(parsedResult);
            setRecommendedCourses(parsedResult.recommendedCourses ?? []);
            setIsLoading(false);
            return;
        }

        const loadRecommendations = async () => {
            if (!fallbackLevel) {
                setIsLoading(false);
                return;
            }
            const courses = await getDiagnosisRecommendations(countryId, fallbackLevel);

            setRecommendedCourses(courses);
            setIsLoading(false);
        };

        loadRecommendations();
    }, [countryId, fallbackLevel]);

    if (isLoading) {
        return (
            <main className="min-h-screen w-full bg-[#F5F6F8] px-4 py-10">
                <section className="mx-auto w-full max-w-3xl py-20">
                    <article className="rounded-3xl bg-white p-10 text-center shadow-sm">
                        <h1 className="text-2xl font-bold text-[#0A1628]">
                            진단평가 결과를 불러오고 있습니다.
                        </h1>
                    </article>
                </section>
            </main>
        );
    }

    // 폴백 레벨 명칭 매핑 가독성 개선
    const getFallbackLevelName = (level?: DiagnosisLevel) => {
        switch (level) {
            case "BEGINNER": return "초급";
            case "INTERMEDIATE": return "중급";
            case "ADVANCED": return "고급";
            default: return "추천";
        }
    };

    const levelName = result?.levelName ?? getFallbackLevelName(fallbackLevel);
    const score = result?.score;
    const correctCount = result?.correctCount;
    const totalCount = result?.totalCount;

    return (
        <main className="min-h-screen w-full bg-[#F5F7FA] px-4 py-10">
            <section className="mx-auto w-full max-w-5xl py-20">
                {/* 진단 완료 섹션 */}
                <article className="rounded-3xl bg-white p-10 text-center shadow-sm">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#EEF5FF]">
                        <Image
                            src="/images/medal.svg"
                            alt="진단평가 완료 이미지"
                            width={28}
                            height={28}
                            className="object-contain"
                        />
                    </span>

                    <h1 className="mt-5 text-3xl font-bold text-[#0A1628]">
                        진단평가가 완료되었습니다.
                    </h1>
                    <p className="mt-3 text-sm font-medium text-[#8A9BB0]">
                        결과를 바탕으로 나에게 맞는 강의를 추천해드릴게요.
                    </p>

                    <div className="mt-6 inline-flex rounded-xl bg-[#FFF3E0] px-6 py-3 text-sm font-bold text-[#E65100]">
                        추천 단계: {levelName}
                    </div>

                    {score !== undefined && (
                        <dl className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-3">
                            <div className="rounded-2xl bg-[#F5F7FA] px-4 py-5">
                                <dt className="text-xs font-semibold text-[#8A94A6]">점수</dt>
                                <dd className="mt-2 text-xl font-bold text-[#0A1628]">{score}점</dd>
                            </div>

                            <div className="rounded-2xl bg-[#F5F7FA] px-4 py-5">
                                <dt className="text-xs font-semibold text-[#8A94A6]">정답</dt>
                                <dd className="mt-2 text-xl font-bold text-[#0A1628]">{correctCount}</dd>
                            </div>

                            <div className="rounded-2xl bg-[#F5F7FA] px-4 py-5">
                                <dt className="text-xs font-semibold text-[#8A94A6]">전체</dt>
                                <dd className="mt-2 text-xl font-bold text-[#0A1628]">{totalCount}</dd>
                            </div>
                        </dl>
                    )}
                </article>

                {/* 추천 강의 섹션 */}
                <section className="mt-8" aria-labelledby="recommended-course-title">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 id="recommended-course-title" className="text-2xl font-bold text-[#0A1628]">
                            추천 강의
                        </h2>
                        <Link
                            href={`/classroom/${continentCode}/${countryId}`}
                            className="text-sm font-bold text-[#439A97]"
                        >
                            전체 강의 보기
                        </Link>
                    </div>

                    {recommendedCourses.length === 0 ? (
                        <article className="rounded-2xl bg-white p-8 text-center shadow-sm">
                            <h3 className="text-lg font-bold text-[#0A1628]">
                                추천 강의가 없습니다.
                            </h3>
                            <p className="mt-2 text-sm font-medium text-[#8A94A6]">
                                강의 목록에서 원하는 강의를 직접 선택해보세요.
                            </p>
                        </article>
                    ) : (
                        <ul className="grid gap-5 md:grid-cols-3">
                            {recommendedCourses.map((course) => (
                                <li key={course.courseId}>
                                    <Link
                                        href={`/classroom/${continentCode}/${countryId}/lecture/${course.courseId}`}
                                        className="block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="h-36 bg-[#DDEDEA]">
                                            {course.thumbnailUrl && (
                                                <img
                                                    src={course.thumbnailUrl}
                                                    alt={course.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <span className="inline-flex rounded-lg bg-[#EAF7F6] px-3 py-1 text-xs font-bold text-[#439A97]">
                                                {course.levelName}
                                            </span>

                                            <h3 className="mt-3 line-clamp-2 text-lg font-bold text-[#0A1628]">
                                                {course.title}
                                            </h3>

                                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#8A94A6]">
                                                {course.description}
                                            </p>

                                            <div className="mt-5 flex items-center justify-between">
                                                <span className="text-sm font-semibold text-[#8A94A6]">
                                                    {course.paid ? "구매 완료" : "수강 가능"}
                                                </span>
                                                <strong className="text-base font-bold text-[#439A97]">
                                                    {formatPrice(course.price)}
                                                </strong>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* 하단 네비게이션 */}
                <nav className="mt-8 flex gap-4" aria-label="진단평가 결과 이동">
                    <Link
                        href={`/classroom/${continentCode}/${countryId}`}
                        className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white text-base font-bold text-[#0A1628] transition hover:bg-gray-50"
                    >
                        강의 목록으로 이동
                    </Link>

                    <Link
                        href="/classroom/packagelounge"
                        className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-[#439A97] text-base font-bold text-white transition hover:bg-[#367C79]"
                    >
                        패키지 라운지로 이동
                    </Link>
                </nav>
            </section>
        </main>
    );
}