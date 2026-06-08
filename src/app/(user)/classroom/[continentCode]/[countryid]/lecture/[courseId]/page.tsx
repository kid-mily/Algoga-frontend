// 강의 홈 화면

'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import LectureActionCard from "@/features/classroom/components/LectureActionCard";
import LectureAttachments from "@/features/classroom/components/LectureAttachments";
import LectureReviews from "@/features/classroom/components/LectureReviews";
import { CourseItem, CourseReviewSummary } from "@/features/classroom/components/types";
import { getCourseDetail, getCourseReviewSummary } from "@/features/services/lectureDetail.service";

const getParamValue = (value: string | string[] | undefined) => {
    if (!value) return "";
    return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

export default function LectureDescription() {
    const params = useParams();
    const router = useRouter();

    const continentCode = getParamValue(params.continentCode);
    const countryId = getParamValue(params.countryid); 
    const courseId = getParamValue(params.courseId);

    // 💡 [수정] 아래 useEffect 안에서 가져올 유연한 데이터를 위해 상태 타입을 교집합(&)으로 명시해 줍니다.
    const [course, setCourse] = useState<(CourseItem & { isPaid?: boolean; purchased?: boolean }) | null>(null);
    const [reviewSummary, setReviewSummary] = useState<CourseReviewSummary | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPaid, setIsPaid] = useState(false); 

    useEffect(() => {
        if (!countryId || !courseId || !continentCode) return;

        const fetchDetailData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [courseData, summaryData] = await Promise.all([
                    getCourseDetail(countryId, courseId) as Promise<CourseItem & { isPaid?: boolean; purchased?: boolean }>,
                    getCourseReviewSummary(courseId).catch((err) => {
                        console.warn("리뷰 데이터가 없습니다.", err);
                        return null; 
                    })
                ]);

                if (!courseData) {
                    setError("해당 강의 정보를 찾을 수 없습니다.");
                    return;
                }

                setCourse(courseData);
                setReviewSummary(summaryData);

                // 백엔드 API 설계명(isPaid 또는 purchased)에 맞춰 유연하게 반응하도록 방어 코드를 짰습니다.
                if (courseData.isPaid !== undefined) {
                    setIsPaid(courseData.isPaid);
                } else if (courseData.purchased !== undefined) {
                    setIsPaid(courseData.purchased);
                }

            } catch (err: any) {
                const errorMessage = err?.response?.data?.message || err?.message || "데이터를 불러오는 중 오류가 발생했습니다.";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetailData();
    }, [countryId, courseId, continentCode]);

    const handleActionClick = () => {
        const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('accessToken'); 
        
        if (!isLoggedIn) {
            if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
                router.push('/auth/login');
            }
            return;
        }

        if (isPaid) { 
            // 결제 완료 상태면 수강 페이지(/study)로 이동
            router.push(`/classroom/${continentCode}/${countryId}/lecture/${courseId}/study`);
        } else {
            // 결제 전이면 결제 페이지로 이동
            router.push(`/classroom/${continentCode}/${countryId}/lecture/${courseId}/payment/single`);
        }
    };

    const handleReviewClick = () => {
        router.push(`/classroom/${continentCode}/${countryId}/lecture/${courseId}/review`);
    };

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center text-sm text-gray-500">강의 정보를 로딩 중입니다...</div>;
    }

    if (error || !course) {
        return <div className="min-h-screen flex justify-center items-center text-red-500 font-bold">{error}</div>;
    }

    return (
        <div className="p-10 w-full min-h-screen bg-[#f5f6f8]">
            <div className="w-full max-w-4xl mx-auto pt-4 px-4 space-y-6">
                <SubHeader
                    backHref={`/classroom/${continentCode}/${countryId}`}
                    backText="강의 선택으로 돌아가기"
                    title={course.title}
                    description={course.description || "여행 전 필요한 모든 것을 배워보세요"}
                />
                
                <LectureActionCard 
                    course={course}
                    isPaid={isPaid}
                    onActionClick={handleActionClick}
                />
                
                <LectureAttachments fileUrls={course.fileUrls} />
                <LectureReviews summary={reviewSummary} onReviewClick={handleReviewClick} />
            </div>
        </div>
    );
}