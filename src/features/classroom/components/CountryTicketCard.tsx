import Link from "next/link";
import type { Country } from "./types";
import { getCountryTicketStyle } from "./countryTicketStyle";

interface Props {
    country: Country;
    continentCode: string;
}

export default function CountryTicketCard({ country, continentCode }: Props) {
    const style = getCountryTicketStyle(continentCode);
    const href = `/classroom/${country.continentCode}/${country.countryId}`.toLowerCase();

    return (
        <Link
        href={href}
        className="group relative block overflow-hidden rounded-2xl border border-[#E1E8EF] bg-white shadow-[0_8px_24px_rgba(55,88,110,0.07)] transition hover:-translate-y-0.5 hover:border-[#B7DAD7] hover:shadow-[0_14px_34px_rgba(55,88,110,0.12)]"
        >
        <div className={`absolute left-0 top-0 h-full w-1 ${style.accent}`} />

        <div className="relative min-h-[142px] px-5 py-4 pl-6">
            <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[#E1E8EF] bg-[#F3F8FC]" />
            <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[#E1E8EF] bg-[#F3F8FC]" />

            <div className="flex items-center justify-between gap-3">
            <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${style.soft} ${style.text}`}
            >
                {country.countryCode}
            </span>

            <span className="text-[9px] font-bold tracking-[0.16em] text-[#A0AEC0]">
                LMS
            </span>
            </div>

            <h3 className="mt-4 truncate text-xl font-bold text-[#0A1628]">
            {country.countryName}
            </h3>

            <p className="mt-2 text-sm font-medium text-[#718096]">
            {country.courseCount}개 강의
            </p>

            <div className="mt-5 flex items-center justify-between border-t border-dashed border-[#D6E0E8] pt-3">
            <span className="text-[9px] font-bold tracking-[0.14em] text-[#A0AEC0]">
                CLASSROOM
            </span>

            <span
                className={`text-xs font-semibold transition group-hover:translate-x-0.5 ${style.text}`}
            >
                입장하기
            </span>
            </div>
        </div>
        </Link>
    );
}