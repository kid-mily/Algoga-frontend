// 대륙별 국가 선택 페이지

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountrySelectHeader from "@/features/classroom/components/CountrySelectHeader";
import CountrySelectSection from "@/features/classroom/components/CountrySelectSection";
import type { Country } from "@/features/classroom/components/types";
import { getCountries } from "@/features/services/countrySelect.service";

export const revalidate = 3600;

const ALLOWED_CONTINENTS = [
  "ASIA",
  "EUROPE",
  "NORTH_AMERICA",
  "SOUTH_AMERICA",
  "AFRICA",
  "OCEANIA",
  "ANTARCTICA",
] as const;

const CONTINENT_NAMES: Record<string, string> = {
  ASIA: "아시아",
  EUROPE: "유럽",
  NORTH_AMERICA: "북아메리카",
  SOUTH_AMERICA: "남아메리카",
  AFRICA: "아프리카",
  OCEANIA: "오세아니아",
  ANTARCTICA: "남극",
};

const ALLOWED_CONTINENT_SET = new Set<string>(ALLOWED_CONTINENTS);

type CountrySelectPageProps = {
  params: Promise<{
    continentCode: string;
  }>;
};

const normalizeContinentCode = (continentCode?: string) => {
  const normalizedContinentCode = continentCode?.trim().toUpperCase();

  if (
    !normalizedContinentCode ||
    !ALLOWED_CONTINENT_SET.has(normalizedContinentCode)
  ) {
    return null;
  }

  return normalizedContinentCode;
};

const getContinentName = (continentCode: string) => {
  return CONTINENT_NAMES[continentCode] ?? continentCode;
};

export function generateStaticParams() {
  return ALLOWED_CONTINENTS.map((continentCode) => ({
    continentCode: continentCode.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: CountrySelectPageProps): Promise<Metadata> {
  const { continentCode } = await params;
  const normalizedContinentCode = normalizeContinentCode(continentCode);

  if (!normalizedContinentCode) {
    return {
      title: "강의실",
      description: "국가별 여행 강의를 선택하고 학습을 시작하세요.",
      openGraph: {
        type: "website",
        title: "강의실 | ALGOGA",
        description: "국가별 여행 강의를 선택하고 학습을 시작하세요.",
        url: "/classroom",
        siteName: "ALGOGA",
        locale: "ko_KR",
        images: [
          {
            url: "/images/og-image.png",
            width: 1100,
            height: 740,
            alt: "ALGOGA 강의실",
          },
        ],
      },
    };
  }

  const continentName = getContinentName(normalizedContinentCode);
  const description = `${continentName} 국가별 여행 강의를 선택하고 학습을 시작하세요.`;
  const pagePath = `/classroom/${normalizedContinentCode.toLowerCase()}`;

  return {
    title: `${continentName} 강의실`,
    description,
    openGraph: {
      type: "website",
      title: `${continentName} 강의실 | ALGOGA`,
      description,
      url: pagePath,
      siteName: "ALGOGA",
      locale: "ko_KR",
      images: [
        {
          url: "/images/og-image.png",
          width: 1100,
          height: 740,
          alt: `${continentName} ALGOGA 강의실`,
        },
      ],
    },
  };
}

export default async function CountrySelectPage({
  params,
}: CountrySelectPageProps) {
  const { continentCode } = await params;
  const normalizedContinentCode = normalizeContinentCode(continentCode);

  if (!normalizedContinentCode) {
    notFound();
  }

  let countries: Country[] = [];
  let errorMessage = "";

  try {
    countries = await getCountries(normalizedContinentCode);
  } catch (error) {
    console.error("[country-select] 국가 목록 조회 실패:", error);
    errorMessage = "국가 데이터를 불러오지 못했습니다.";
  }

  return (
    <main className="min-h-screen w-full bg-[#F3F8FC] px-4 pb-14 pt-6 sm:px-6 lg:px-10">
      <section className="mx-auto w-full max-w-4xl">
        <CountrySelectHeader />

        <section className="mt-6">
          <CountrySelectSection
            countries={countries}
            errorMessage={errorMessage}
            continentCode={normalizedContinentCode}
          />
        </section>
      </section>
    </main>
  );
}