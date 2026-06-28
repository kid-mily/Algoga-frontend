import { notFound } from "next/navigation";
import CountrySelectHeader from "@/features/classroom/components/CountrySelectHeader";
import CountrySelectSection from "@/features/classroom/components/CountrySelectSection";
import type { Country } from "@/features/classroom/components/types";
import { getCountries } from "@/features/services/countrySelect.service";

const ALLOWED_CONTINENTS = new Set([
  "ASIA",
  "EUROPE",
  "NORTH_AMERICA",
  "SOUTH_AMERICA",
  "AFRICA",
  "OCEANIA",
  "ANTARCTICA",
]);

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
    !ALLOWED_CONTINENTS.has(normalizedContinentCode)
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
    <main className="min-h-screen w-full bg-[#f5f6f8] p-10">
      <section className="mx-auto w-full max-w-3xl px-4">
        <CountrySelectHeader />

        <section className="w-full">
          <CountrySelectSection
            countries={countries}
            errorMessage={errorMessage}
          />
        </section>
      </section>
    </main>
  );
}