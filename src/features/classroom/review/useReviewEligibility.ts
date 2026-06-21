// 후기 작성 자격 판단

"use client";

import { useEffect, useMemo, useState } from "react";
import { ApiRequestError } from "@/lib/api";
import { getMe } from "@/features/services/user.service";
import { getCourseStudyDetail } from "@/features/services/courseStudy.service";
import { useCourseCompletionStatus } from "@/features/classroom/completion/hooks/useCourseCompletionStatus";
import { CourseReview } from "@/features/services/courseReview.service";

export function useReviewEligibility(
    courseId: string,
    reviews: CourseReview[]
) {
    const completion = useCourseCompletionStatus(courseId);

    const [userId, setUserId] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewCreated, setReviewCreated] = useState(false);

    useEffect(() => {
        if (!courseId) {
        setIsLoading(false);
        return;
        }

        let active = true;

        const checkEligibility = async () => {
        try {
            setIsLoading(true);

            try {
            const user = await getMe();

            if (!active) return;

            setUserId(user.userId);
            setIsLoggedIn(true);
            } catch (error) {
            if (!active) return;

            if (
                error instanceof ApiRequestError &&
                error.status === 401
            ) {
                setUserId(null);
                setIsLoggedIn(false);
                setIsPurchased(false);
                return;
            }

            throw error;
            }

            try {
            // 결제 또는 수강 등록된 사용자만 200을 받습니다.
            await getCourseStudyDetail(courseId);

            if (!active) return;
            setIsPurchased(true);
            } catch (error) {
            if (!active) return;

            if (
                error instanceof ApiRequestError &&
                error.status === 403
            ) {
                setIsPurchased(false);
                return;
            }

            throw error;
            }
        } catch (error) {
            console.error(
            "[review] 후기 작성 자격 확인 실패:",
            error
            );

            if (active) {
            setIsPurchased(false);
            }
        } finally {
            if (active) {
            setIsLoading(false);
            }
        }
        };

        checkEligibility();

        return () => {
        active = false;
        };
    }, [courseId]);

    const hasReviewed = useMemo(() => {
        if (reviewCreated) return true;
        if (userId === null) return false;

        return reviews.some(
        (review) => review.userId === userId
        );
    }, [reviewCreated, reviews, userId]);

    return {
        isLoading:
        isLoading || completion.isLoading,
        isLoggedIn,
        isPurchased,
        isCompleted: completion.isCompleted,
        hasReviewed,
        markReviewed: () => setReviewCreated(true),
    };
}