import type { Feature, Geometry } from "geojson";

export interface CountryFeatureProperties {
    continent?: string;
    name?: string;
    name_ko?: string;
    iso_a2?: string;
    iso_a3?: string;
}

export type CountryFeature = Feature<Geometry, CountryFeatureProperties>;