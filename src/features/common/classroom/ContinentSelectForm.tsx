'use client';

import Link from "next/link";
import LearnMethod from "../main/components/LearningMethod";
import CountrySelectForm from "./CountrySelectSection";

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
      {/* 카드 */}
      <div className="w-full mt-12"
        style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "20px",
        }}>
          {continents.map((item) => (
    
          <Link
            key={item.name}
            href={`/classroom/${item.name}`}
          >
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
          </Link>
          ))}
        </div>
      </div>
  );
}