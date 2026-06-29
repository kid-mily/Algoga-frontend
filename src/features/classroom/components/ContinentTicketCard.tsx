import Link from "next/link";
import type { Continent } from "./types";
import { getContinentStyle } from "./continentStyle";

interface Props {
    continent: Continent;
}

export default function ContinentTicketCard({ continent }: Props) {
    const style = getContinentStyle(continent.continentCode);

    return (
        <Link
            href={`/classroom/${continent.continentCode}`.toLowerCase()}
            className="group relative block overflow-hidden rounded-2xl border border-[#E1E8EF] bg-white shadow-[0_8px_24px_rgba(55,88,110,0.07)] transition hover:-translate-y-0.5 hover:border-cyan-800"
            >
            <div className={`absolute left-0 top-0 h-full w-1 ${style.accent}`} />

            <div className="relative grid min-h-[148px] grid-cols-[minmax(0,1fr)_116px]">
                <div className="min-w-0 px-5 py-4 pl-6">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${style.soft}`}>
                        {style.label}
                    </span>

                    <h3 className="mt-3 truncate text-xl font-bold text-[#0A1628]">
                        {continent.continentName}
                    </h3>

                    <p className="mt-1 text-[13px] leading-5 text-[#718096]">
                        {style.description}
                    </p>

                    <p className="mt-4 text-[9px] font-bold tracking-[0.14em] text-[#A0AEC0]">
                        COUNTRY
                    </p>
                    <p className="text-sm font-bold text-[#0A1628]">
                        {continent.countryCount}
                    </p>
                    </div>

                    <div className="flex flex-col items-center justify-center border-l border-dashed border-[#D6E0E8] bg-[#FAFCFE] px-4 text-center">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.soft}`}>
                        <span className="text-base font-black">{style.code}</span>
                    </div>

                    <p className="mt-2 text-[9px] font-bold tracking-[0.16em] text-[#A0AEC0]">
                        강의실
                    </p>
                    <p className="text-sm font-black text-[#0A1628]">입장</p>
                    <span className="mt-2 text-xs font-semibold text-[#439A97]">
                        학습하기
                    </span>
                </div>
            </div>
        </Link>
    );
}