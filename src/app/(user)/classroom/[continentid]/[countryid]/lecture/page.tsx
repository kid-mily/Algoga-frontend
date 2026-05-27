// 강의 안내 페이지 (강의실 입장, 첨부파일 다운)

'use client'
import SubHeader from "@/features/contentmanage/SubHeader";
import { useParams, useRouter } from "next/navigation";

// 임시 데이터
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

export default function LectureDescription() {
    const { continentid, countryid, lectureid } = useParams();
    const router = useRouter();

    return (
       <div className="w-full min-h-screen bg-[#f5f6f8] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 상단 타이틀 */}
        <SubHeader
            backHref={`/classroom/${continentid}/${countryid}`}
            backText="강의 선택으로 돌아가기"
            title="클래스룸"
            description="여행 전 필요한 모든 것을 배워보세요"
      />

        {/* 강좌 듣기 */}
        {/* 강의 명 */}
        <h1 className="text-2xl font-bold text-[#0A1628]">{CLASS_INFO.title}</h1>
        {/* 강좌 듣기 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-[#0A1628]">강좌 듣기</h2>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                <img src="/images/BookGray.svg" alt="책" />
                {CLASS_INFO.chapterCount}개 챕터</p>
          </div>
          <button className="bg-[#439A97] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#357A78]"
          onClick={() =>
                router.push(`/classroom/${continentid}/${countryid}/lecture/${lectureid}/payment/single`)
}>
            결제하기
          </button>
        </div>

        {/* 첨부 자료 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-lg font-bold text-[#0A1628] flex items-center gap-2">
                <img src="/images/download.svg" alt="다운" />
                 첨부 자료
            </h2>
            <button className="text-sm text-gray-400 hover:underline">다운받기</button>
          </div>
          
          <div>
            {CLASS_INFO.attachments.map((file) => (
                <div key={file.id} className="flex justify-between items-center bg-[#F5F7FA] p-4 rounded-xl border border-gray-100 mb-3">
                    <span className="text-sm font-medium text-[#0A1628]">{file.name}</span>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">{file.size}</span>
                    <button className="text-xs text-[#439A97] font-semibold hover:underline">다운 받기</button>
                    </div>
              </div>
            ))}
          </div>
        </div>

        {/* 수강 후기 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold ">수강 후기</h2>
            <button className="text-sm text-gray-400 hover:underline">더보기 &gt;</button>
          </div>

          {/* 별점 */}
          <div className="flex flex-col items-center gap-8 pb-8">
            <div className="text-cente p-5">
              <div className="text-5xl font-bold text-[#0A1628] text-center">{CLASS_INFO.rating.average}</div>
              <div className="text-amber-400 text-xl mt-1">★★★★★</div>
              <p className="text-xs text-gray-400 text-center mt-2">{CLASS_INFO.rating.totalCount}개의 후기</p>
            </div>

            {/* 별점 퍼센트 바 */}
            <div className="flex-1 w-full mb-3">
              {CLASS_INFO.rating.stats.map((stat) => (
                <div key={stat.score} className="flex items-center gap-4 text-sm text-gray-500 mb-1">
                  <span>{stat.score}점</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                  <span className="text-right">{stat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 후기 */}
          <div className="divide-y divide-gray-100">
            {CLASS_INFO.reviews.map((review) => (
              <div key={review.id} className="py-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-50 text-[#439A97] rounded-full flex items-center justify-center font-bold text-sm">
                    {review.author.substring(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-800">{review.author}</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <div className="text-amber-400 text-xs">
                      {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                    </div>
                  </div>
                </div>
                
                {/* 후기 내용 */}
                <p className="text-gray-600 text-sm leading-relaxed mt-3">{review.content}</p>
                
                <button className="flex items-center mt-3 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100">
                  👍 도움돼요 ({review.likes})
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}