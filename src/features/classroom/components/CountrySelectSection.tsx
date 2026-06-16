import Link from "next/link";
import { Country } from "./types";

interface CountrySelectSectionProps {
  countries?: Country[];
}

export default function CountrySelectSection({
  countries = [],
}: CountrySelectSectionProps) {
  return (
    <section aria-labelledby="country-select-title" className="p-5">
      <h2 id="country-select-title" className="sr-only">
        국가 선택
      </h2>

      {countries.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500">
          등록된 국가가 없습니다.
        </p>
      ) : (
        <ul className="grid w-full grid-cols-4 gap-10">
          {countries.map((country) => {
            const href =
              `/classroom/${country.continentCode}/${country.countryId}`.toLowerCase();

            return (
              <li key={country.countryCode}>
                <Link
                  href={href}
                  className="flex h-48 w-52 flex-col justify-center rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-xl font-bold text-[#0A1628]">
                    {country.countryName}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-[#8A94A6]">
                    {country.courseCount}개 강의
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}