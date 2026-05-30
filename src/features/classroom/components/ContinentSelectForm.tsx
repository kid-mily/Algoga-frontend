// 대륙 선택

'use client';

import { useEffect, useState } from "react";
import { Continent } from "./types";
import { getContinents } from "../../services/ContinentSelection.service";
import { useRouter } from "next/navigation";


export default function ContinentSelectForm() {
  // API에서 받아올 데이터를 담을 상태
  const [continents, setContinents] = useState<Continent[]>([]);

  // API 호출
  useEffect(() => {
    const continentApi = async () => {
      const data = await getContinents();
      setContinents(data);
    };

    continentApi();
  }, []);

  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto mb-2 pl-10 pr-10">
      {/* 카드 */}
      <div className="w-full mt-2 grid grid-cols-3 gap-5">
          {continents.map((item) => (
    
          <div
            key={item.continentCode}    // 고유값인 코드를 키값으로 사용
            // 주소창에 소문자로 찍히도록 .toLowerCase() 이용
            onClick={() => router.push(`/classroom/${item.continentCode}`.toLowerCase())}
          >
            <div
            className="bg-white rounded-2xl border border-[#E9EEF5] p-6 h-48 hover:shadow-md transition cursor-pointer">
              {/* 상단 */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 flex items-center justify-center">
                  <span className="text-4xl">🌍</span>
                </div>
                <span className="text-[#B8C2CC] text-xl">›</span>
              </div>
              
              {/* 텍스트 */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-[#0A1628]">
                  {item.continentName}
                </h3>
                
                <p className="mt-2 text-sm text-[#8A9BB0]">{item.countryCount}개 국가</p>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
  );
}