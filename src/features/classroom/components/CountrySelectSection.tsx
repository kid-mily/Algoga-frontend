'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCountries } from "../../services/countrySelect.service";
import { Country } from "./types";

// 대륙 영문 코드를 한글로 바꾸기 위한 객체 (상수형태로 대문자 변경)
const continentNameMap: Record<string, string> = {
  ASIA: "아시아",
  EUROPE: "유럽",
  NORTH_AMERICA: "북아메리카",
  SOUTH_AMERICA: "남아메리카",
  AFRICA: "아프리카",
  OCEANIA: "오세아니아",
  ANTARCTICA: "남극",
};

export default function ContinentPage() {
  const router = useRouter();
  const params = useParams();
  
  // 주소창에서 대륙 코드 추출
  const continentParam = (params.continentCode as string) || "";
  const [countries, setCountries] = useState<Country[]>([]);

  // 대륙별 국가 데이터 받아오기
  useEffect(() => {
    if (!continentParam) return;

    const fetchCountries = async () => {
      try {
        // 백엔드에 맞춰 대문자로 변환하여 요청
        const upperContinentCode = continentParam.toUpperCase();
        const data = await getCountries(upperContinentCode);
        
        setCountries(data);
      } catch (error) {
        console.error("국가 목록을 불러오는데 실패했습니다:", error);
      }
    };

    fetchCountries();
  }, [continentParam]);

  // 대소문자 어떤 주소로 들어와도 한글로 변환 (없으면 원본 출력)
  const currentContinentName = 
    continentNameMap[continentParam.toUpperCase()] || continentParam;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">{currentContinentName} 나라 목록</h1>

      {/* 국가 카드 목록 */}
      <div className="grid grid-cols-4 gap-10 w-full">
        {countries.map((country) => {
          // 다음 페이지 이동을 위해 상세 URL을 소문자로 포맷팅
          const targetUrl = `/classroom/${country.continentCode}/${country.countryCode}`.toLowerCase();

          return (
            <div 
              key={country.countryCode} 
              onClick={() => router.push(targetUrl)}
              className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer w-52 h-48 flex flex-col justify-center transition-all duration-200"
            >
              <p className="text-xl font-bold text-[#0A1628]">
                {country.countryName}
              </p>
              
              <p className="text-sm text-[#8A94A6] mt-2 font-medium">
                {country.courseCount}개 강좌
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}