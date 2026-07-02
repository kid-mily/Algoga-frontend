import CountrySearchClient from "./CountrySearchClient";
import type { Country } from "./types";

interface CountrySelectSectionProps {
  countries?: Country[];
  errorMessage?: string;
  continentCode: string;
}

const CONTINENT_NAMES: Record<string, string> = {
  ASIA: "아시아",
  EUROPE: "유럽",
  NORTH_AMERICA: "북아메리카",
  SOUTH_AMERICA: "남아메리카",
  AFRICA: "아프리카",
  OCEANIA: "오세아니아",
  ANTARCTICA: "남극",
};

const continentTicketStyle: Record<
  string,
  {
    accent: string;
    soft: string;
    text: string;
  }
> = {
  ASIA: {
    accent: "bg-[#439A97]",
    soft: "bg-[#EEF8F7]",
    text: "text-[#357F7C]",
  },
  EUROPE: {
    accent: "bg-[#4F7FD9]",
    soft: "bg-[#F0F5FF]",
    text: "text-[#416AB8]",
  },
  NORTH_AMERICA: {
    accent: "bg-[#D6A640]",
    soft: "bg-[#FFF8E8]",
    text: "text-[#A87512]",
  },
  SOUTH_AMERICA: {
    accent: "bg-[#D96A5B]",
    soft: "bg-[#FFF1EF]",
    text: "text-[#BC4F43]",
  },
  AFRICA: {
    accent: "bg-[#C8843A]",
    soft: "bg-[#FFF4E8]",
    text: "text-[#A86425]",
  },
  OCEANIA: {
    accent: "bg-[#7C6FD6]",
    soft: "bg-[#F3F1FF]",
    text: "text-[#6558C8]",
  },
  ANTARCTICA: {
    accent: "bg-[#94A3B8]",
    soft: "bg-[#F1F5F9]",
    text: "text-[#64748B]",
  },
};

export type CountryTicketStyle = {
  accent: string;
  soft: string;
  text: string;
};

const getTicketStyle = (continentCode: string): CountryTicketStyle => {
  return (
    continentTicketStyle[continentCode.toUpperCase()] ?? {
      accent: "bg-[#94A3B8]",
      soft: "bg-[#F8FAFC]",
      text: "text-[#64748B]",
    }
  );
};

const getContinentName = (continentCode: string) => {
  return CONTINENT_NAMES[continentCode.toUpperCase()] ?? continentCode;
};

export default function CountrySelectSection({
  countries = [],
  errorMessage = "",
  continentCode,
}: CountrySelectSectionProps) {
  const style = getTicketStyle(continentCode);
  const continentName = getContinentName(continentCode);

  return (
    <section aria-labelledby="country-select-title" className="w-full">
      <CountrySearchClient
        countries={countries}
        errorMessage={errorMessage}
        continentCode={continentCode}
        continentName={continentName}
        ticketStyle={style}
      />
    </section>
  );
}