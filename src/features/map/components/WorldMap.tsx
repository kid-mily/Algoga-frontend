// 지도 

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import type {
  Feature,
  GeoJsonObject,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import L, { type Layer, type PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";

import { getCountries } from "@/features/services/countrySelect.service";
import type { Country } from "@/features/classroom/components/types";

interface CountryFeatureProperties {
  continent?: string;
  name?: string;
  name_ko?: string;
  iso_a2?: string;
  iso_a3?: string;
}

type CountryFeature = Feature<Geometry, CountryFeatureProperties>;

const INITIAL_POSITION: [number, number] = [30, 10];
const MAP_BOUNDS = L.latLngBounds([-85, -180], [85, 180]);

const CONTINENT_NAME_KO: Record<string, string> = {
  Asia: "아시아",
  Europe: "유럽",
  Africa: "아프리카",
  "North America": "북아메리카",
  "South America": "남아메리카",
  Oceania: "오세아니아",
  Antarctica: "남극",
};

const CONTINENT_CODE_MAP: Record<string, string> = {
  Asia: "ASIA",
  Europe: "EUROPE",
  Africa: "AFRICA",
  "North America": "NORTH_AMERICA",
  "South America": "SOUTH_AMERICA",
  Oceania: "OCEANIA",
  Antarctica: "ANTARCTICA",
};

const CONTINENT_COLOR_MAP: Record<string, string> = {
  Asia: "#439A97",
  Europe: "#3A86FF",
  Africa: "#FF006E",
  "North America": "#FFBE0B",
  "South America": "#FB5607",
  Oceania: "#8338EC",
  Antarctica: "#94A3B8",
};

const normalizeName = (value?: string) =>
  (value ?? "").replace(/\s/g, "").toLowerCase();

const getContinentColor = (continent?: string) => {
  if (!continent) {
    return "#94A3B8";
  }

  return CONTINENT_COLOR_MAP[continent] ?? "#94A3B8";
};

const getFeatureCountryName = (feature: CountryFeature) =>
  feature.properties.name_ko ??
  feature.properties.name ??
  "이름 없는 국가";

export default function WorldMap() {
  const router = useRouter();

  const [rawGeoJson, setRawGeoJson] = useState<GeoJsonObject | null>(null);
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [isCountryLoading, setIsCountryLoading] = useState(false);

  const backendCountriesRef = useRef<Country[]>([]);
  const layersByContinentRef = useRef<Record<string, L.Path[]>>({});
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        const response = await fetch("/data/world.geo.json");

        if (!response.ok) {
          throw new Error("지도 데이터를 불러오지 못했습니다.");
        }

        const data = (await response.json()) as GeoJsonObject;
        setRawGeoJson(data);
      } catch (error) {
        console.error("지도 데이터 로드 실패:", error);
        setNoticeMessage("지도 데이터를 불러오지 못했습니다.");
      }
    };

    loadGeoJson();
  }, []);

  useEffect(() => {
    if (!noticeMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setNoticeMessage("");
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [noticeMessage]);

  useEffect(() => {
    if (!selectedContinent) {
      backendCountriesRef.current = [];
      return;
    }

    const continentCode = CONTINENT_CODE_MAP[selectedContinent];

    if (!continentCode) {
      backendCountriesRef.current = [];
      setNoticeMessage("지원하지 않는 대륙입니다.");
      return;
    }

    const loadCountries = async () => {
      try {
        setIsCountryLoading(true);

        const countries = await getCountries(continentCode);

        backendCountriesRef.current = Array.isArray(countries)
          ? countries
          : [];
      } catch (error) {
        console.error("국가 목록 조회 실패:", error);

        backendCountriesRef.current = [];
        setNoticeMessage("국가 정보를 불러오지 못했습니다.");
      } finally {
        setIsCountryLoading(false);
      }
    };

    loadCountries();
  }, [selectedContinent]);

  useEffect(() => {
    layersByContinentRef.current = {};
  }, [selectedContinent]);

  const findSupportedCountry = (feature: CountryFeature) => {
    const { name_ko, name, iso_a2, iso_a3 } = feature.properties;

    return backendCountriesRef.current.find((country) => {
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

  const styleFeature = (
    feature?: Feature<Geometry, GeoJsonProperties>
  ): PathOptions => {
    const properties = feature?.properties as
      | CountryFeatureProperties
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
        fillColor: "#CBD5E1",
        color: "#CBD5E1",
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

  const onEachCountry = (
    feature: Feature<Geometry, GeoJsonProperties>,
    layer: Layer
  ) => {
    const countryFeature = feature as CountryFeature;
    const pathLayer = layer as L.Path;

    const continent = countryFeature.properties.continent ?? "기타";
    const countryName = getFeatureCountryName(countryFeature);

    if (!selectedContinent) {
      const continentLayers = layersByContinentRef.current[continent] ?? [];

      layersByContinentRef.current[continent] = [
        ...continentLayers,
        pathLayer,
      ];
    }

    const tooltipText = selectedContinent
      ? countryName
      : CONTINENT_NAME_KO[continent] ?? continent;

    pathLayer.bindTooltip(tooltipText, {
      direction: "top",
      sticky: true,
    });

    pathLayer.on({
      mouseover: () => {
        if (!selectedContinent) {
          const continentLayers =
            layersByContinentRef.current[continent] ?? [];

          continentLayers.forEach((continentLayer) => {
            continentLayer.setStyle({
              fillOpacity: 0.7,
            });
          });

          return;
        }

        if (continent === selectedContinent) {
          pathLayer.setStyle({
            fillOpacity: 0.85,
          });
        }
      },

      mouseout: () => {
        if (!selectedContinent) {
          const continentLayers =
            layersByContinentRef.current[continent] ?? [];

          continentLayers.forEach((continentLayer) => {
            continentLayer.setStyle({
              fillOpacity: 0.5,
            });
          });

          return;
        }

        if (continent === selectedContinent) {
          const isSelected = selectedCountry === countryName;

          pathLayer.setStyle({
            fillOpacity: isSelected ? 0.85 : 0.6,
            weight: isSelected ? 1.5 : 0.4,
            color: isSelected ? "#2C3E50" : getContinentColor(continent),
          });
        }
      },

      click: () => {
        setNoticeMessage("");

        if (!selectedContinent) {
          setSelectedContinent(continent);
          setSelectedCountry("");

          const polygonLayer = layer as L.Polygon;

          mapRef.current?.fitBounds(polygonLayer.getBounds(), {
            padding: [40, 40],
          });

          return;
        }

        if (continent !== selectedContinent) {
          return;
        }

        setSelectedCountry(countryName);

        if (isCountryLoading) {
          setNoticeMessage(
            "국가 정보를 불러오는 중입니다. 잠시 후 다시 선택해주세요."
          );
          return;
        }

        const supportedCountry = findSupportedCountry(countryFeature);

        if (supportedCountry && supportedCountry.active !== false) {
          router.push(
            `/classroom/${supportedCountry.continentCode.toLowerCase()}/${supportedCountry.countryId}`
          );

          return;
        }

        setNoticeMessage(`${countryName}은 아직 준비중인 국가입니다.`);
      },
    });
  };

  const handleResetMap = () => {
    setSelectedContinent("");
    setSelectedCountry("");
    setNoticeMessage("");

    backendCountriesRef.current = [];
    layersByContinentRef.current = {};

    mapRef.current?.setView(INITIAL_POSITION, 2.3);
  };

  return (
    <section className="flex h-full w-full flex-col" aria-label="세계 지도">
      <style jsx global>{`
        .leaflet-interactive:focus {
          outline: none;
        }
      `}</style>

      <header className="z-[1000] border-b bg-white">
        <div className="flex items-center justify-between p-4">
          <p className="text-sm font-semibold text-gray-600">
            {!selectedContinent
              ? "대륙을 선택하세요"
              : selectedCountry
                ? selectedCountry
                : `${
                    CONTINENT_NAME_KO[selectedContinent] ?? selectedContinent
                  } 국가 선택`}
          </p>

          {selectedContinent && (
            <button
              type="button"
              onClick={handleResetMap}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              대륙 보기
            </button>
          )}
        </div>
      </header>

      <div className="relative h-[500px] w-full flex-1 overflow-hidden">
        {noticeMessage && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2">
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl border border-[#BFE7E4] bg-white px-6 py-5 text-center text-sm font-bold text-[#0F3F3D] shadow-[0_18px_45px_rgba(15,23,42,0.24)]"
            >
              {noticeMessage}
            </div>
          </div>
        )}

        {!rawGeoJson ? (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-400">
            지도를 구성 중입니다...
          </div>
        ) : (
          <MapContainer
            ref={mapRef}
            center={INITIAL_POSITION}
            zoom={2.3}
            minZoom={2}
            maxBounds={MAP_BOUNDS}
            maxBoundsViscosity={1}
            scrollWheelZoom
            className="z-10 h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              noWrap
            />

            <GeoJSON
              key={`${selectedContinent}-${selectedCountry}`}
              data={rawGeoJson}
              style={styleFeature}
              onEachFeature={onEachCountry}
            />
          </MapContainer>
        )}
      </div>
    </section>
  );
}