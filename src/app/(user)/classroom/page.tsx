import ContinentHeader from "@/features/classroom/components/ContinentHeader";
import ContinentSelectForm from "@/features/classroom/components/ContinentSelectForm";
import LearnMethod from "@/features/main/learningmethod/LearningMethod";
import { getContinents } from "@/features/services/ContinentSelection.service";
import { getCountries } from "@/features/services/countrySelect.service";

export default async function ClassRoomMainPage() {
  const continents = await getContinents();

  const countryKeywordsByContinent = Object.fromEntries(
    await Promise.all(
      continents.map(async (continent) => {
        try {
          const countries = await getCountries(continent.continentCode);

          return [
            continent.continentCode.toUpperCase(),
            countries.map((country) => country.countryName),
          ];
        } catch (error) {
          console.error(
            `[classroom] ${continent.continentCode} 국가 목록 조회 실패:`,
            error
          );

          return [continent.continentCode.toUpperCase(), []];
        }
      })
    )
  ) as Record<string, string[]>;

  return (
    <main className="min-h-screen w-full bg-[#F3F8FC] px-4 pb-14 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <ContinentHeader />

        <section className="mt-6">
          <ContinentSelectForm
            continents={continents}
            countryKeywordsByContinent={countryKeywordsByContinent}
          />
        </section>

        <section className="mt-10">
          <LearnMethod />
        </section>
      </div>
    </main>
  );
}