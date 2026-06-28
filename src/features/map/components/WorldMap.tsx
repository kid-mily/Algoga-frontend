"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GeoJSON, MapContainer, ZoomControl } from "react-leaflet";
import type { Feature, GeoJsonProperties, Geometry } from "geojson";
import L, { type Layer } from "leaflet";
import "leaflet/dist/leaflet.css";

import MapHeader from "./MapHeader";
import MapLoading from "./MapLoading";
import MapNotice from "./MapNotice";
import { useWorldGeoJson } from "../hooks/useWorldGeoJson";
import { useContinentCountries } from "../hooks/useContinentCountries";
import { continent_name_ko, intial_position, intial_zoom, map_bounds } from "../constants/mapConstants";
import { findSupportedCountry, getContinentColor, getCountryStyle, getFeatureCountryName } from "../utils/mapUtils";
import type { CountryFeature } from "../types";

export default function WorldMap() {
  const router = useRouter();

  const { geoJson, errorMessage: geoJsonErrorMessage } = useWorldGeoJson();

  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const {
    countries,
    isLoading: isCountryLoading,
    errorMessage: countryErrorMessage,
  } = useContinentCountries(selectedContinent);

  const countriesRef = useRef(countries);
  const isCountryLoadingRef = useRef(isCountryLoading);
  const countryErrorMessageRef = useRef(countryErrorMessage);

  useEffect(() => {
    countriesRef.current = countries;
  }, [countries]);

  useEffect(() => {
    isCountryLoadingRef.current = isCountryLoading;
  }, [isCountryLoading]);

  useEffect(() => {
    countryErrorMessageRef.current = countryErrorMessage;
  }, [countryErrorMessage]);

  const layersByContinentRef = useRef<Record<string, L.Path[]>>({});
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const nextMessage = geoJsonErrorMessage || countryErrorMessage;

    if (nextMessage) {
      setNoticeMessage(nextMessage);
    }
  }, [geoJsonErrorMessage, countryErrorMessage]);

  useEffect(() => {
    if (!noticeMessage) return;

    const timer = window.setTimeout(() => {
      setNoticeMessage("");
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [noticeMessage]);

  useEffect(() => {
    layersByContinentRef.current = {};
  }, [selectedContinent]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const styleFeature = (feature?: Feature<Geometry, GeoJsonProperties>) =>
    getCountryStyle(feature, selectedContinent, selectedCountry);

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

    pathLayer.bindTooltip(
      selectedContinent
        ? countryName
        : continent_name_ko[continent] ?? continent,
      {
        direction: "top",
        sticky: true,
      }
    );

    pathLayer.on({
      mouseover: () => {
        if (!selectedContinent) {
          const continentLayers =
            layersByContinentRef.current[continent] ?? [];

          continentLayers.forEach((continentLayer) => {
            continentLayer.setStyle({
              fillOpacity: 0.72,
            });
          });

          return;
        }

        if (continent === selectedContinent) {
          pathLayer.setStyle({
            fillOpacity: 0.88,
          });
        }
      },

      mouseout: () => {
        if (!selectedContinent) {
          const continentLayers =
            layersByContinentRef.current[continent] ?? [];

          continentLayers.forEach((continentLayer) => {
            continentLayer.setStyle({
              fillOpacity: 0.52,
            });
          });

          return;
        }

        if (continent === selectedContinent) {
          const isSelected = selectedCountry === countryName;

          pathLayer.setStyle({
            fillOpacity: isSelected ? 0.88 : 0.62,
            weight: isSelected ? 1.6 : 0.5,
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
            maxZoom: 4,
          });

          return;
        }

        if (continent !== selectedContinent) {
          setNoticeMessage("선택한 대륙의 국가를 선택해 주세요.");
          return;
        }

        setSelectedCountry(countryName);

        const latestCountries = countriesRef.current;

        if (isCountryLoadingRef.current) {
          setNoticeMessage(
            "국가 정보를 불러오는 중입니다. 잠시 후 다시 선택해 주세요."
          );
          return;
        }

        if (countryErrorMessageRef.current) {
          setNoticeMessage("국가 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
          return;
        }

        if (latestCountries.length === 0) {
          setNoticeMessage(
            "국가 정보를 확인하는 중입니다. 잠시 후 다시 선택해 주세요."
          );
          return;
        }

        const supportedCountry = findSupportedCountry(latestCountries, countryFeature);

        if (!supportedCountry || supportedCountry.active === false) {
          setNoticeMessage(`${countryName}은(는) 아직 준비 중인 국가입니다.`);
          return;
        }

        router.push(
          `/classroom/${supportedCountry.continentCode.toLowerCase()}/${supportedCountry.countryId}`
        );
      },
    });
  };

  const handleResetMap = () => {
    setSelectedContinent("");
    setSelectedCountry("");
    setNoticeMessage("");

    layersByContinentRef.current = {};
    mapRef.current?.setView(intial_position, intial_zoom);
  };

  return (
    <section className="h-full min-h-0 w-full" aria-label="세계 지도">
      <style jsx global>{`
        .leaflet-interactive:focus {
          outline: none;
        }

        .leaflet-container {
          background: #dff3fb;
        }

        .leaflet-control-zoom {
          border: 0 !important;
          box-shadow: 0 10px 24px rgba(52, 79, 98, 0.16);
        }

        .leaflet-control-zoom a {
          border: 0 !important;
          color: #357a78 !important;
          font-weight: 800;
        }
      `}</style>

      <div className="relative h-full min-h-0 w-full overflow-hidden">
        <MapHeader
          selectedContinent={selectedContinent}
          selectedCountry={selectedCountry}
          onReset={handleResetMap}
        />

        <MapNotice message={noticeMessage} />

        {!geoJson ? (
          <MapLoading />
        ) : (
          <MapContainer
            ref={mapRef}
            center={intial_position}
            zoom={intial_zoom}
            minZoom={2.2}
            maxZoom={6}
            maxBounds={map_bounds}
            maxBoundsViscosity={1}
            scrollWheelZoom
            zoomControl={false}
            className="z-10 h-full w-full"
          >
            <ZoomControl position="bottomleft" />

            <GeoJSON
              key={`${selectedContinent}-${selectedCountry}`}
              data={geoJson}
              style={styleFeature}
              onEachFeature={onEachCountry}
            />
          </MapContainer>
        )}
      </div>
    </section>
  );
}
