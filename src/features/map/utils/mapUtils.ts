import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { PathOptions } from "leaflet";
import { Country } from "@/features/classroom/components/types";
import { CountryFeature } from "../types";
import { CONTINENT_COLOR_MAP, DEFAULT_MAP_COLOR, DISABLED_MAP_COLOR } from "../constants/mapConstants";

export const normalizeName = (value?: string) =>
    (value ?? "").replace(/\s/g, "").toLowerCase();

export const getContinentColor = (continent?: string) => {
    if (!continent) return DEFAULT_MAP_COLOR;

    return CONTINENT_COLOR_MAP[continent] ?? DEFAULT_MAP_COLOR;
};

export const getFeatureCountryName = (feature: CountryFeature) =>
    feature.properties.name_ko ?? feature.properties.name ?? "이름 없는 국가";

export const findSupportedCountry = (
    countries: Country[],
    feature: CountryFeature
) => {
    const { name_ko, name, iso_a2, iso_a3 } = feature.properties;

    return countries.find((country) => {
        const backendCountryName = normalizeName(country.countryName);
        const backendCountryCode = normalizeName(country.countryCode);

        return (
        backendCountryName === normalizeName(name_ko) ||
        backendCountryName === normalizeName(name) ||
        backendCountryCode === normalizeName(iso_a2) ||
        backendCountryCode === normalizeName(iso_a3)
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
        weight: 0.2,
        fillOpacity: 0.5,
        };
    }

    if (continent !== selectedContinent) {
        return {
        fillColor: DISABLED_MAP_COLOR,
        color: DISABLED_MAP_COLOR,
        weight: 0.1,
        fillOpacity: 0.08,
        };
    }

    const isSelected = selectedCountry === countryName;

    return {
        fillColor: continentColor,
        color: isSelected ? "#2C3E50" : continentColor,
        weight: isSelected ? 1.5 : 0.4,
        fillOpacity: isSelected ? 0.85 : 0.6,
    };
};