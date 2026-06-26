'use client';

import SubHeader from '@/features/common/components/SubHeader';
import { useParams } from 'next/navigation';


const CLASS_INFO = {
  title: '미국 동부 여행 준비',
  chapterCount: 12,
  attachments: [
    { id: 1, name: '여행 준비 체크리스트.pdf', size: '2.3 MB' },
    { id: 2, name: '필수 단어 회화집.pdf', size: '1.8 MB' },
    { id: 3, name: '지도 및 관광지 안내.jpg', size: '3.5 MB' },
  ],
  rating: {
    average: 4.8,
    totalCount: 3,
    stats: [
      { score: 5, percentage: 70 },
      { score: 4, percentage: 20 },
      { score: 3, percentage: 8 },
      { score: 2, percentage: 2 },
      { score: 1, percentage: 0 },
    ],
  },
  reviews: [
    {
      id: 1,
      author: '예클리버',
      date: '2024.04.28',
      stars: 5,
      content: '강의가 정말 알차고 실용적이에요! 덕분에 도쿄 여행 완벽하게 다녀왔습니다.',
      likes: 24,
    },
    {
      id: 2,
      author: '일분덕후',
      date: '2024.04.25',
      stars: 4,
      content: '교통편 부분이 특히 도움 많이 됐어요. 추천합니다!',
      likes: 18,
    },
    {
      id: 3,
      author: '여행초보',
      date: '2024.04.20',
      stars: 5,
      content: '초보자도 쉽게 따라할 수 있게 설명이 잘 되어있어요. 강추!',
      likes: 31,
    },
  ],
};

export default function ReviewDetailPage() {
    const { continentid, countryid } = useParams();
    
    return( 
    <div className="w-full min-h-screen bg-[#f5f6f8] py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* 상단 서브 헤더 */}
            <SubHeader  
            backHref={`/classroom/${continentid}/${countryid}/lecture`}
            backText="돌아가기"
            title="수강 후기" 
            description=""
            />
            
            {/* 1. 상단 별점 대시보드 카드 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-row items-center gap-10">
                
                {/* 평균 점수 */}
                <div className="text-center border-gray-100">
                    <span className="text-5xl font-bold text-[#0A1628]">
                        {CLASS_INFO.rating.average}
                    </span>
                    
                    <div className="text-amber-400 text-xl mt-2 tracking-wider">★★★★★</div>
                    <p className="text-xs text-gray-400 mt-2">{CLASS_INFO.rating.totalCount}개의 후기</p>
                </div>
                
                {/* 오른쪽: 별점 분포 막대 바 */}
                <div className="flex-1 w-full space-y-2.5">
                    {CLASS_INFO.rating.stats.map((stat) => (
                        <div key={stat.score} className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="w-8 shrink-0 text-right">{stat.score}점</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                className="h-full bg-amber-400 rounded-full" 
                                style={{ width: `${stat.percentage}%` }}
                                />
                            </div>
                            <span className="w-10 text-left shrink-0">{stat.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* 2. 하단 후기 리스트 카드 (디자인 누락 수정) */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="divide-y divide-gray-100">
                    {CLASS_INFO.reviews.map((review) => (
                        <div key={review.id} className="py-6"> 
                        
                        {/* 작성자 프로필 & 별점 */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#EBF5F5] text-[#439A97] rounded-full flex items-center justify-center font-bold text-sm">
                                {review.author.substring(0, 1)}
                            </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-gray-800">{review.author}</span>
                                        <span className="text-xs text-gray-400">{review.date}</span>
                                    </div>
                                    <div className="text-amber-400 text-xs mt-0.5">
                                        {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed pl-1 mt-2">{review.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}