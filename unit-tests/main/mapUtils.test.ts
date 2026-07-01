jest.mock("leaflet", () => ({
  __esModule: true,
  default: {
    latLngBounds: jest.fn(() => ({})),
  },
}));

import {
  findSupportedCountry,
  getContinentColor,
  getCountryStyle,
  getFeatureCountryName,
  normalizeName,
} from "@/features/map/utils/mapUtils";
import {
  default_map_color,
  disabled_map_color,
} from "@/features/map/constants/mapConstants";
import type { CountryFeature } from "@/features/map/types";
import type { Country } from "@/features/classroom/types";

const createFeature = (
  properties: Partial<CountryFeature["properties"]>
): CountryFeature =>
  ({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [],
    },
    properties: {
      name: "Japan",
      name_ko: "일본",
      iso_a2: "JP",
      iso_a3: "JPN",
      continent: "Asia",
      ...properties,
    },
  }) as CountryFeature;

describe("map utils", () => {
  test("normalizeName은 공백과 특수문자를 제거하고 소문자로 변환한다", () => {
    expect(normalizeName(" South Korea ")).toBe("southkorea");
    expect(normalizeName("Korea, Republic of")).toBe("korearepublicof");
    expect(normalizeName(null)).toBe("");
  });

  test("getContinentColor는 대륙 색상 또는 기본 색상을 반환한다", () => {
    expect(getContinentColor()).toBe(default_map_color);
    expect(getContinentColor("UNKNOWN")).toBe(default_map_color);
    expect(getContinentColor("Asia")).not.toBe(default_map_color);
  });

  test("getFeatureCountryName은 한국어 이름을 우선 반환한다", () => {
    expect(getFeatureCountryName(createFeature({ name_ko: "대한민국" }))).toBe(
      "대한민국"
    );
  });

  test("getFeatureCountryName은 한국어 이름이 없으면 영문 이름을 반환한다", () => {
    expect(
      getFeatureCountryName(createFeature({ name_ko: undefined, name: "Japan" }))
    ).toBe("Japan");
  });

  test("findSupportedCountry는 국가명으로 지원 국가를 찾는다", () => {
    const countries: Country[] = [
      {
        countryId: 1,
        countryCode: "KR",
        countryName: "대한민국",
        continentCode: "ASIA",
        courseCount: 5,
      },
    ];

    const result = findSupportedCountry(
      countries,
      createFeature({ name_ko: "대한민국" })
    );

    expect(result?.countryId).toBe(1);
  });

  test("findSupportedCountry는 iso 코드로도 지원 국가를 찾는다", () => {
    const countries: Country[] = [
      {
        countryId: 2,
        countryCode: "JP",
        countryName: "일본",
        continentCode: "ASIA",
        courseCount: 3,
      },
    ];

    const result = findSupportedCountry(
      countries,
      createFeature({ name_ko: "Japan", iso_a2: "JP" })
    );

    expect(result?.countryId).toBe(2);
  });

  test("getCountryStyle은 대륙 선택이 없으면 기본 지도 스타일을 반환한다", () => {
    const style = getCountryStyle(createFeature({ continent: "Asia" }), "", "");

    expect(style.weight).toBe(0.35);
    expect(style.opacity).toBe(0.95);
    expect(style.fillOpacity).toBe(0.58);
  });

  test("getCountryStyle은 선택된 대륙과 다르면 비활성 스타일을 반환한다", () => {
    const style = getCountryStyle(
      createFeature({ continent: "Europe" }),
      "Asia",
      ""
    );

    expect(style.fillColor).toBe(disabled_map_color);
    expect(style.color).toBe(disabled_map_color);
    expect(style.fillOpacity).toBe(0.1);
  });

  test("getCountryStyle은 선택된 국가면 강조 스타일을 반환한다", () => {
    const style = getCountryStyle(
      createFeature({ continent: "Asia", name_ko: "일본" }),
      "Asia",
      "일본"
    );

    expect(style.color).toBe("#233044");
    expect(style.weight).toBe(1.7);
    expect(style.fillOpacity).toBe(0.9);
  });
});