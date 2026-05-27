import TabNavigation from "@/features/classroom/TabNavigation";
import SubHeader from "@/features/contentmanage/SubHeader";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    continentid: string;
    countryid: string;
  }>;
}

export default async function LectureListPage({ params }: PageProps) {
  const { continentid, countryid } = await params;

  // 임시 더미 데이터
  const lectures = [
    {
      id: 1,
      title: '도쿄 완전 정복 2024',
      image: '/images/japan.jpg',
      level: '초급',
      period: '4주',
      students: 1234,
      rating: 4.8,
      reviewCount: 523,
      teacher: '이수중',
      price: '89,000원',
    },
    {
      id: 2,
      title: '오사카 맛집 투어',
      image: '/images/osaka.jpg',
      level: '중급',
      period: '2주',
      students: 856,
      rating: 4.9,
      reviewCount: 342,
      teacher: '김여행',
      price: '59,000원',
    },
    {
      id: 3,
      title: '교토 문화 체험',
      image: '/images/kyoto.jpg',
      level: '고급',
      period: '6주',
      students: 645,
      rating: 4.7,
      reviewCount: 289,
      teacher: '박문화',
      price: '129,000원',
    },
  ];

  // 난이도 색상
  const levelColor: Record<string, string> = {
    초급: 'bg-[#4A6B6B]',
    중급: 'bg-[#D9A752]',
    고급: 'bg-[#C95B5B]',
  };

  return (
    <div className="w-full min-h-screen p-10 bg-[#f5f6f8]">
      <div className="w-full max-w-5xl mx-auto pt-32 pb-20 px-4">

        {/* 헤더 */}
        <SubHeader
          backHref={`/classroom/${continentid}`}
          backText="나라 선택으로 돌아가기"
          title={`${countryid} 여행`}
          description="원하는 학습 방식을 선택하세요"
        />

        {/* 단과 / 패키지 탭 */}
        <TabNavigation />
        
        {/* 배너 */}
        <div className="w-ful bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            {/* 아이콘 */}
            <div className=" w-12 h-12 bg-[#EEF5FF] rounded-2xl flex items-center justify-center text-xl">📝</div>
            {/* 텍스트 */}
            <div>
              <h3 className="font-bold text-[#0A1628] text-sm">내 실력 확인하고 추천받기</h3>
              <p className=" text-xs text-[#8A94A6] mt-1">진단 평가로 나에게 맞는 강의를 찾아보세요</p>
            </div>
        </div>

          {/* 버튼 */}
          <button
            className=" bg-[#439A97] text-white text-xs font-semibold px-5 py-4 rounded-2xl hover:bg-[#597777]">진단 평가 시작</button>
        </div>

        {/* 정렬 필터 */}
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-50">인기순</button>
          <button className="px-3 py-1 text-xs border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-50">별점 높은 순</button>
          <button className="px-3 py-1 text-xs border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-50">가격 높은 순</button>
        </div>

        {/* 강의 수 */}
        <div className="mb-3">
          <p className="flex items-center mt-5 mb-4 text-sm font-bold text-[#0A1628]">
            {countryid} 강좌 목록
            <span className="ml-2 text-sm font-bold text-[#8A9BB0]">({lectures.length}개)</span>
          </p>
        </div>

        {/* 강의 카드 */}
        <div className="w-full"
        style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "20px",
        }}>
          {lectures.map((lecture) => (
            <Link key={lecture.id} 
            href={`/classroom/${continentid}/${countryid}/lecture/${lecture.id}`}
            className="flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md cursor-pointer">
              
              {/* 이미지 영역 */}
              <div className="relative w-full h-[160px]">
                <img src={lecture.image} alt={lecture.title} className="w-full h-full object-cover" />
                {/* 난이도 배지 */}
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${levelColor[lecture.level]}`}>
                  {lecture.level}
                </span>
              </div>

              {/* 강의 카드 본문 */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  {/* 제목 */}
                  <h4 className="font-bold text-[#0A1628]">{lecture.title}</h4>
                  {/* 정보 */}
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs text-[#8A94A6] mt-4">
                    <div className="flex items-center gap-1">⏱️ {lecture.period}</div>
                    <div className="flex items-center gap-1">👤 {lecture.students}명</div>
                    <div className="flex items-center gap-1">⭐ {lecture.rating}</div>
                    <div className="flex items-center gap-1">👨‍🏫 {lecture.teacher}</div>
                  </div>
                </div>

                {/* 가격 */}
                <div className="flex justify-between items-center mt-5 border-t border-gray-50">
                  <p className="text-[#439A97] font-bold text-xl px-5 py-2">{lecture.price}</p>
                  <p className="text-xs text-[#8A94A6] bg-[#F5F7FA] px-2 rounded-md">{lecture.period} 수강권</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}