import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { PathOptions } from "leaflet";
import { Country } from "@/features/classroom/components/types";
import { CountryFeature } from "../types";
import {
  continent_color_map,
  default_map_color,
  disabled_map_color,
} from "../constants/mapConstants";

export const normalizeName = (value?: string | null) =>
  (value ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(/[().,'’]/g, "")
    .toLowerCase();

const isSameNonEmpty = (a?: string | null, b?: string | null) => {
  const left = normalizeName(a);
  const right = normalizeName(b);

  return left.length > 0 && right.length > 0 && left === right;
};

export const getContinentColor = (continent?: string) => {
  if (!continent) return default_map_color;

  return continent_color_map[continent] ?? default_map_color;
};

export const getFeatureCountryName = (feature: CountryFeature) =>
  feature.properties.name_ko ??
  feature.properties.name ??
  "이름 없는 국가";

export const findSupportedCountry = (
  countries: Country[],
  feature: CountryFeature
) => {
  const { name_ko, name, iso_a2, iso_a3 } = feature.properties;

  return countries.find((country) => {
    return (
      isSameNonEmpty(country.countryName, name_ko) ||
      isSameNonEmpty(country.countryName, name) ||
      isSameNonEmpty(country.countryCode, iso_a2) ||
      isSameNonEmpty(country.countryCode, iso_a3)
    );
  });
};

export const getCountryStyle = (
  feature: Feature<Geometry, GeoJsonProperties> | undefined,
  selectedContinent: string,
  selectedCountry: string
): PathOptions => {
  const properties = feature?.properties as
    | CountryFeature["properties"]
    | undefined;

  const continent = properties?.continent;
  const countryName = properties?.name_ko ?? properties?.name ?? "";
  const continentColor = getContinentColor(continent);

  if (!selectedContinent) {
    return {
      fillColor: continentColor,
      color: continentColor,
      weight: 0.3,
      fillOpacity: 0.52,
    };
  }

  if (continent !== selectedContinent) {
    return {
      fillColor: disabled_map_color,
      color: disabled_map_color,
      weight: 0.1,
      fillOpacity: 0.08,
    };
  }

  const isSelected = selectedCountry === countryName;

  return {
    fillColor: continentColor,
    color: isSelected ? "#2C3E50" : continentColor,
    weight: isSelected ? 1.6 : 0.5,
    fillOpacity: isSelected ? 0.88 : 0.62,
  };
};