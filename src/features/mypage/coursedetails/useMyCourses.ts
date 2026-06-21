"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { getLatestDiagnosis, getMyCourses } from "@/features/services/myCourse.service";
import { LatestDiagnosisResult, MyCourse } from "./types";

export function useMyCourses() {
    const router = useRouter();

    const [courses, setCourses] = useState<MyCourse[]>([]);
    const [latestDiagnosis, setLatestDiagnosis] =
        useState<LatestDiagnosisResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const load = useCallback(async () => {
        try {
        setIsLoading(true);
        setErrorMessage("");

        const [courseResult, diagnosisResult] =
            await Promise.allSettled([
            getMyCourses(),
            getLatestDiagnosis(),
            ]);

        if (courseResult.status === "rejected") {
            throw courseResult.reason;
        }

        setCourses(courseResult.value);

        if (diagnosisResult.status === "fulfilled") {
            setLatestDiagnosis(diagnosisResult.value);
        } else {
            console.error("[mypage] 최신 진단 결과 조회 실패:", diagnosisResult.reason);
        }
        } catch (error) {
        console.error("[mypage] 수강 강좌 조회 실패:", error);

        if (
            error instanceof ApiRequestError &&
            error.status === 401
        ) {
            router.replace("/auth/login");
            return;
        }

        setErrorMessage(
            error instanceof Error
            ? error.message
            : "수강 강좌를 불러오지 못했습니다."
        );
        } finally {
        setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        // 처음 화면 진입 시 수강 강좌 조회
        load();

        // 수료 상태 변경 이벤트가 발생하면 다시 조회
        window.addEventListener(
            "course-completion-changed",
            load
        );

        return () => {
            window.removeEventListener(
                "course-completion-changed",
                load
            );
        };
    }, [load]);

    const markReviewWritten = (courseId: number) => {
        setCourses((previous) =>
        previous.map((course) =>
            course.courseId === courseId
            ? {
                ...course,
                reviewWritten: true,
                }
            : course
        )
        );
    };

    return {
        courses,
        latestDiagnosis,
        isLoading,
        errorMessage,
        refresh: load,
        markReviewWritten,
    };
}