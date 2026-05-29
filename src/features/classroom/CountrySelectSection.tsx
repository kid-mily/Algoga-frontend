'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCountries } from "../services/countrySelect.service";
import { Country } from "./types";

// 영문 대문자 코드를 한글로 바꾸기 위한 객체
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
  
  // 주소창에서 대륙 꺼내기
  const params = useParams();
  
  // 주소창이 소문자로 들어오므로 소문자 상태 그대로 continentParam에 담기
  const continentParam = (params.continentCode as string) || "";

  const [countries, setCountries] = useState<Country[]>([]);

  // 백엔드에서 데이터 받아오기
  useEffect(() => {
    if (!continentParam) return; // 주소창에 아무것도 없으면 패스

    const countryApi = async () => {
      // 주소창은 소문자(asia)이지만 백엔드는 대문자(ASIA)를 원하므로, 
      // API 요청을 보낼 때만 .toUpperCase()로 대문자로 변환해서 보냄
      const upperContinentCode = continentParam.toUpperCase();
      const data = await getCountries(upperContinentCode);
      setCountries(data);
    };
    countryApi();
  }, [continentParam]); // 주소창의 대륙 코드가 바뀔 때마다 자동으로 새로 실행

  // 주소창의 소문자를 대문자로 바꾼 뒤, 사전에서 알맞은 이름을 찾음
  // 만약 없으면 영어 대문자로 출력
  // 대소문자 어떤 주소로 들어와도 사전을 통해 확실하게 한글(예: 아시아)로 변환
  const currentContinentName = continentNameMap[continentParam] || continentNameMap[continentParam.toUpperCase()] || continentParam;

  return (
    <div className="p-5">
      {/* 영어 대신 한국어로 */}
      <h1 className="text-2xl font-bold mb-5">{currentContinentName} 나라 목록</h1>

      {/* 나라 출력 */}
      <div className="grid grid-cols-4 gap-10 w-full">
        {countries.map((country: Country) => {
          
          // 카드 클릭 시 이동할 국가 상세 주소를 소문자로 강제 변환
          // toLowerCase()로 국가 상세 주소도 소문자로 넘어가게 고정
          const targetUrl = `/classroom/${country.continentCode}/${country.countryCode}`.toLowerCase();

          return (
            <div 
              key={country.countryCode} 
              onClick={() => router.push(targetUrl)}
              className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer w-52 h-48 flex flex-col justify-center"
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