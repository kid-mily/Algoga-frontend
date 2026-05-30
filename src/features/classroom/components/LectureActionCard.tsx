'use client'

import { CourseItem } from './types';

interface LectureActionCardProps {
    course: CourseItem;
    isPaid: boolean;
    onActionClick: () => void; // 부모가 쥐어주는 클릭 함수
}

export default function LectureActionCard({ course, isPaid, onActionClick }: LectureActionCardProps) {
    return (
        <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center mt-4">
                <div>
                    <h2 className="text-lg font-bold text-[#0A1628]">
                        강의 듣기
                    </h2>

                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                        {/* 난이도 */}
                        <span className="text-[#439A97] font-semibold">
                            {course.levelName}
                        </span>

                        <span>|</span>

                        {/* 가격 */}
                        <span>{course.price > 0 ? `${course.price.toLocaleString()}원` : '무료'}</span>
                    </p>
                </div>

                {/* 버튼 클릭 시 부모가 준 onActionClick 실행 */}
                <button
                    className="px-6 py-3 rounded-2xl font-semibold text-white bg-[#439A97] hover:bg-[#357A78] transition-colors"
                    onClick={onActionClick}
                >
                    {isPaid ? '강의 듣기' : '결제하기'}
                </button>
            </div>
        </div>
    );
}