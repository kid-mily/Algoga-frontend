// 지도 

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import type { Feature, GeoJsonProperties, Geometry } from "geojson";
import L, { type Layer } from "leaflet";
import "leaflet/dist/leaflet.css";

import MapHeader from "./MapHeader";
import MapLoading from "./MapLoading";
import MapNotice from "./MapNotice";
import { useWorldGeoJson } from "../hooks/useWorldGeoJson";
import { useContinentCountries } from "../hooks/useContinentCountries";
import {
  CONTINENT_NAME_KO,
  INITIAL_POSITION,
  INITIAL_ZOOM,
  MAP_BOUNDS,
} from "../constants/mapConstants";
import {
  findSupportedCountry,
  getContinentColor,
  getCountryStyle,
  getFeatureCountryName,
} from "../utils/mapUtils";
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

  const styleFeature = (
    feature?: Feature<Geometry, GeoJsonProperties>
  ) => getCountryStyle(feature, selectedContinent, selectedCountry);

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
            "국가 정보를 불러오는 중입니다. 잠시 후 다시 선택해 주세요."
          );
          return;
        }

        const supportedCountry = findSupportedCountry(countries, countryFeature);

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

    layersByContinentRef.current = {};

    mapRef.current?.setView(INITIAL_POSITION, INITIAL_ZOOM);
  };

  return (
    <section className="flex h-full w-full flex-col" aria-label="세계 지도">
      <style jsx global>{`
        .leaflet-interactive:focus {
          outline: none;
        }
      `}</style>

      <MapHeader
        selectedContinent={selectedContinent}
        selectedCountry={selectedCountry}
        onReset={handleResetMap}
      />

      <div className="relative h-[500px] w-full flex-1 overflow-hidden">
        <MapNotice message={noticeMessage} />

        {!geoJson ? (
          <MapLoading />
        ) : (
          <MapContainer
            ref={mapRef}
            center={INITIAL_POSITION}
            zoom={INITIAL_ZOOM}
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