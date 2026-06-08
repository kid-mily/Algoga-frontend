// 수강 후기

'use client'

import { CourseReviewSummary } from "./types";

interface LectureReviewsProps {
    summary: CourseReviewSummary | null;
    onReviewClick: () => void;      // 더보기 클릭 시 실행될 함수
}

export default function LectureReviews({ summary, onReviewClick }: LectureReviewsProps) {
    // 데이터가 없거나, 리뷰가 없을 때 
    if (!summary || summary.totalReviewCount === 0) {
        return (
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center py-10 text-gray-500">
            아직 작성된 수강 후기가 없습니다.
        </div>
        );
    }

    // API 데이터를 UI 배열 형태로 가공 
    const stats = [
        { score: 5, percentage: summary.fiveStarRate },
        { score: 4, percentage: summary.fourStarRate },
        { score: 3, percentage: summary.threeStarRate },
        { score: 2, percentage: summary.twoStarRate },
        { score: 1, percentage: summary.oneStarRate },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">수강 후기</h2>
                <button 
                    className="text-sm text-gray-400 hover:underline cursor-pointer"
                    onClick={onReviewClick} // 클릭 시 부모에서 정의한 라우팅 실행
                >
                    더보기 &gt;
                </button>
            </div>
            
            {/* 메인 별점 (평균 점수) */}
            <div className="flex flex-col items-center gap-8 pb-8">
                <div className="text-center p-5">
                    {/* 소수점 첫째 자리까지 표시 */}
                    <div className="text-5xl font-bold text-[#0A1628]">{summary.averageRating.toFixed(1)}</div>
                    {/* 평균 별점에 맞춰 꽉 찬 별과 빈 별을 조핮해서 출력 */}
                    <div className="text-amber-400 text-xl mt-1">
                        {'★'.repeat(Math.round(summary.averageRating))}
                        {'☆'.repeat(5 - Math.round(summary.averageRating))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{summary.totalReviewCount}개의 후기</p>
                </div>
            
                {/* 점수 퍼센트 */}
                <div className="flex-1 w-full max-w-md">
                    {stats.map((stat) => (
                        <div key={stat.score} className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span>{stat.score}점</span>
                            {/* 회색 배경 */}
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                {/* 노란색 채워지는 바 */}
                                <div 
                                    className="h-full bg-amber-400 rounded-full" 
                                    style={{ width: `${stat.percentage}%` }}
                                />
                            </div>
                            <span className="text-right w-10">{stat.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}