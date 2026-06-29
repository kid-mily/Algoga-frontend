import { notFound } from "next/navigation";
import CountrySelectHeader from "@/features/classroom/components/CountrySelectHeader";
import CountrySelectSection from "@/features/classroom/components/CountrySelectSection";
import type { Country } from "@/features/classroom/components/types";
import { getCountries } from "@/features/services/countrySelect.service";

export const revalidate = 600;

const ALLOWED_CONTINENTS = [
  "ASIA",
  "EUROPE",
  "NORTH_AMERICA",
  "SOUTH_AMERICA",
  "AFRICA",
  "OCEANIA",
  "ANTARCTICA",
] as const;

const ALLOWED_CONTINENT_SET = new Set<string>(ALLOWED_CONTINENTS)

export function generateStaticParams() {
  return ALLOWED_CONTINENTS.map((continentCode) => ({
    continentCode: continentCode.toLowerCase(),
  }));
}

interface CountrySelectPageProps {
  params: Promise<{
    continentCode: string;
  }>;
}

export default async function CountrySelectPage({
  params,
}: CountrySelectPageProps) {
  const { continentCode } = await params;
  const normalizedContinentCode = continentCode?.trim().toUpperCase();

  if (
    !normalizedContinentCode ||
    !ALLOWED_CONTINENT_SET.has(normalizedContinentCode)
  ) {
    notFound();
  }

  let countries: Country[] = [];
  let errorMessage = "";

  try {
    countries = await getCountries(normalizedContinentCode);
  } catch (error) {
    console.error("[country-select] 국가 목록 조회 실패:", error);
    countries = [];
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