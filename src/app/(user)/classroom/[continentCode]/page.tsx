// 나라 선택

import CountrySelectHeader from "@/features/classroom/components/CountrySelectHeader";
import CountrySelectSection from "@/features/classroom/components/CountrySelectSection";
import { getCountries } from "@/features/services/countrySelect.service";

export const revalidate = 1800;

interface CountrySelectPageProps {
  params: Promise<{
    continentCode: string;
  }>;
}

export default async function CountrySelectPage({
  params,
}: CountrySelectPageProps) {
  const { continentCode } = await params;

  const countries = await getCountries(continentCode.toUpperCase());

  return (
    <main className="min-h-screen w-full bg-[#f5f6f8] p-10">
      <section className="mx-auto w-full max-w-4xl px-4 pt-4">
        <CountrySelectHeader />

        <section className="mt-10 w-full">
          <CountrySelectSection countries={countries} />
        </section>
      </section>
    </main>
  );
}