import { CourseCountry } from "../types";

const countryAirportMap: Record<string, string> = {
  ZA: "JNB",
  ZAF: "JNB",
  SOUTHAFRICA: "JNB",
  남아프리카공화국: "JNB",
  EG: "CAI",
  EGY: "CAI",
  EGYPT: "CAI",
  이집트: "CAI",
  CD: "FIH",
  COD: "FIH",
  DRC: "FIH",
  CONGO: "FIH",
  DEMOCRATICREPUBLICOFCONGO: "FIH",
  콩고민주공화국: "FIH",
  AQ: "TNM",
  ATA: "TNM",
  ANTARCTICA: "TNM",
  남극: "TNM",
  남극연구기지: "TNM",
  JP: "NRT",
  JPN: "NRT",
  JAPAN: "NRT",
  일본: "NRT",
  IT: "FCO",
  ITA: "FCO",
  ITALY: "FCO",
  이탈리아: "FCO",
  FR: "CDG",
  FRA: "CDG",
  FRANCE: "CDG",
  프랑스: "CDG",
  US: "LAX",
  USA: "LAX",
  UNITEDSTATES: "LAX",
  미국: "LAX",
  CA: "YVR",
  CAN: "YVR",
  CANADA: "YVR",
  캐나다: "YVR",
  NZ: "AKL",
  NZL: "AKL",
  NEWZEALAND: "AKL",
  뉴질랜드: "AKL",
  AU: "SYD",
  AUS: "SYD",
  AUSTRALIA: "SYD",
  호주: "SYD",
  BR: "GRU",
  BRA: "GRU",
  BRAZIL: "GRU",
  브라질: "GRU",
  AR: "EZE",
  ARG: "EZE",
  ARGENTINA: "EZE",
  아르헨티나: "EZE",
};

const koreaCountryKeys = new Set([
  "KR",
  "KOR",
  "KOREA",
  "SOUTHKOREA",
  "대한민국",
  "한국",
]);

const normalizeAirportKey = (value?: string) =>
  value?.replace(/\s/g, "").toUpperCase() ?? "";

export const getCountryAirportCode = (country: CourseCountry) => {
  const countryCode = normalizeAirportKey(country.countryCode);
  const countryName = normalizeAirportKey(country.countryName);

  if (countryCode.length === 3) return countryCode;

  return countryAirportMap[countryCode] ?? countryAirportMap[countryName] ?? "";
};

export const isKoreaCountry = (country: CourseCountry) => {
  const countryCode = normalizeAirportKey(country.countryCode);
  const countryName = normalizeAirportKey(country.countryName);

  return koreaCountryKeys.has(countryCode) || koreaCountryKeys.has(countryName);
};
