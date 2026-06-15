import Link from "next/link";
import { Continent } from "./types";

interface ContinentSelectFormProps {
  continents: Continent[];
}

export default function ContinentSelectForm({
  continents,
}: ContinentSelectFormProps) {
  return (
    <section aria-labelledby="continent-select-title" className="w-full">
      <h2 id="continent-select-title" className="sr-only">
        대륙 선택
      </h2>

      <ul className="mt-2 grid w-full grid-cols-3 gap-5">
        {continents.map((item) => (
          <li key={item.continentCode}>
            <Link
              href={`/classroom/${item.continentCode}`.toLowerCase()}
              className="block h-48 rounded-2xl border border-[#E9EEF5] bg-white p-6 transition hover:shadow-md"
            >
              <span className="text-4xl" aria-hidden="true">
                🌍
              </span>

              <h3 className="mt-8 text-2xl font-bold text-[#0A1628]">
                {item.continentName}
              </h3>

              <p className="mt-2 text-sm text-[#8A9BB0]">
                {item.countryCount}개 국가
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}