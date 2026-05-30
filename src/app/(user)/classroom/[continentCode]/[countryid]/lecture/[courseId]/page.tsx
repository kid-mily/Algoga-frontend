// 강의 첨부파일 다운, 수강 후기 보는 페이지

'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SubHeader from "@/features/contentmanage/SubHeader";
import LectureActionCard from "@/features/classroom/components/LectureActionCard";
import LectureAttachments from "@/features/classroom/components/LectureAttachments";
import LectureReviews from "@/features/classroom/components/LectureReviews";
import { CourseItem, CourseReviewSummary } from "@/features/classroom/components/types";
import { getCourseDetail, getCourseReviewSummary } from "@/features/services/lectureDetail.service";

// URL 파라미터 추출 
const getParamValue = (value: string | string[] | undefined) => {
    if (!value) return "";
    return decodeURIComponent(Array.isArray(value) ? value[0] : value);
};

export default function LectureDescription() {
    const params = useParams();
    const router = useRouter();

    // 폴더 구조와 일치하는 파라미터 추출
    const continentCode = getParamValue(params.continentCode);
    const countryId = getParamValue(params.countryid); 
    const courseId = getParamValue(params.courseId);

    // 상태 관리
    const [course, setCourse] = useState<CourseItem | null>(null);
    const [reviewSummary, setReviewSummary] = useState<CourseReviewSummary | null>(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPaid, setIsPaid] = useState(false); // 결제 상태

    useEffect(() => {
        // 세 가지 파라미터가 모두 URL에 존재할 때만 API 호출 시작
        if (!countryId || !courseId || !continentCode) {
        return;
        }

        const fetchDetailData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Promise.all로 두 API를 동시에 호출하여 로딩 속도 최적화
            const [courseData, summaryData] = await Promise.all([
            getCourseDetail(countryId, courseId),
            
            // 수강 후기가 없어서 404 에러가 나도 전체 페이지가 터지지 않게 무시
            getCourseReviewSummary(courseId).catch((err) => {
                console.warn("리뷰 데이터가 없습니다.", err);
                return null; 
            })
            ]);

            // 강의 데이터가 없으면 에러 처리
            if (!courseData) {
            setError("해당 강의 정보를 찾을 수 없습니다.");
            return;
            }

            // 가져온 데이터 반영
            setCourse(courseData);
            setReviewSummary(summaryData);
        } catch (err: any) {
            const errorMessage = 
            err?.response?.data?.message || 
            err?.message || 
            "데이터를 불러오는 중 오류가 발생했습니다.";
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
        };

        fetchDetailData();
    }, [countryId, courseId, continentCode]);

    // [결제/수강 버튼] 클릭
    const handleActionClick = () => {
        // 로그인 여부 확인 (로컬스토리지 토큰 확인 방식)
        const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('accessToken'); 
        
        if (!isLoggedIn) {
        if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
            router.push('/auth/login');
        }
        return;
        }

        // 로그인 상태면 결제 여부에 따라 이동
        if (isPaid) { 
            // 결제 완료
            router.push(`/classroom/${continentCode}/${countryId}/lecture/${courseId}/study`);
        } else {
            // 결제 해야 됨
            router.push(`/classroom/${continentCode}/${countryId}/lecture/${courseId}/payment/single`);
        }
    };

    // [리뷰 더보기] 클릭 핸들러
    const handleReviewClick = () => {
        router.push(`/classroom/${continentCode}/${countryId}/lecture/${courseId}/review`);
    };

    // 에러 화면
    if (error || !course) {
        return <div className="min-h-screen flex justify-center items-center text-red-500 font-bold">{error}</div>;
    }

    return (
        <div className="p-10 w-full min-h-screen bg-[#f5f6f8]">
            <div className="w-full max-w-4xl mx-auto pt-4 px-4 space-y-6">
                {/* 헤더 */}
                <SubHeader
                backHref={`/classroom/${continentCode}/${countryId}`}
                backText="강의 선택으로 돌아가기"
                title={course.title}
                description={course.description || "여행 전 필요한 모든 것을 배워보세요"}
                />
                
                {/* 강의 듣기 */}
                <LectureActionCard 
                course={course}
                isPaid={isPaid}
                onActionClick={handleActionClick}
                />
                
                {/* 첨부파일 */}
                <LectureAttachments fileUrls={course.fileUrls} />
                
                {/* 수강 후기 */}
                <LectureReviews 
                summary={reviewSummary} 
                onReviewClick={handleReviewClick}
                />
            </div>
        </div>
    );
}