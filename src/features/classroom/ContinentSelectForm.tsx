'use client';

import LearnMethod from "../main/components/LearningMethod";

const continents = [
  {
    name: "아시아",
    count: "15개 국가",
  },
  {
    name: "유럽",
    count: "23개 국가",
  },
  {
    name: "아메리카",
    count: "12개 국가",
  },
  {
    name: "오세아니아",
    count: "5개 국가",
  },
  {
    name: "아프리카",
    count: "8개 국가",
  },
];

export default function ContinentSelectForm() {
  return (
    <div className="w-full max-w-5xl mx-auto pt-32 pb-20 px-4">
        {/* 상단 */}
      <div className="flex flex-col items-center gap-5 mt-16">
        <img src="/images/Earth.svg" alt="지구" />
        <p className="text-4xl font-bold text-[#0A1628]">어디로 떠나시나요?</p>
        <p className="text-lg text-[#8A9BB0]">대륙을 선택하여 여행을 시작하세요</p>
      </div>

      {/* 검색 */}
      <div className="mt-12 flex items-center gap-4">
        
        {/* 검색창 */}
        <div className="flex-1 h-16 bg-white border border-[#8A9BB0] rounded-2xl px-6 flex items-center shadow-sm">
          <input
            type="text"
            placeholder="여행지 검색..."
            className="w-full bg-transparent outline-none text-[#0A1628] placeholder:text-[#9AA6B2]"
          />
        </div>

        {/* 버튼 */}
        <button className="w-[120px] h-16 bg-[#439A97] rounded-2xl text-white font-semibold hover:bg-[#1f4644] cursor-pointer">
          검색
        </button>
      </div>

      {/* 카드 */}
      <div className="w-full mt-12"
        style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "20px",
        }}>
          {continents.map((item) => (
            <div
            key={item.name}
            className="bg-white rounded-2xl border border-[#E9EEF5] p-6 h-[190px] hover:shadow-md transition cursor-pointer">
              {/* 상단 */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <span className="text-[#B8C2CC] text-xl">›</span>
              </div>
              
              {/* 텍스트 */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-[#0A1628]">
                  {item.name}
                </h3>
                
                <p className="mt-2 text-sm text-[#8A9BB0]">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 학습 방법 */}
        <div className="mt-12">
          <LearnMethod />
        </div>
      </div>
  );
}