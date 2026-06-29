"use client";

import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { GeoJSON, MapContainer, ZoomControl } from "react-leaflet";
import type {
  Feature,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import L, { type Layer } from "leaflet";
import "leaflet/dist/leaflet.css";

import MapHeader from "./MapHeader";
import MapLoading from "./MapLoading";
import MapNotice from "./MapNotice";
import { useWorldGeoJson } from "../hooks/useWorldGeoJson";
import { useContinentCountries } from "../hooks/useContinentCountries";
import {
  continent_name_ko,
  initial_position,
  initial_zoom,
  map_bounds,
} from "../constants/mapConstants";
import {
  findSupportedCountry,
  getContinentColor,
  getCountryStyle,
  getFeatureCountryName,
} from "../utils/mapUtils";
import type { CountryFeature } from "../types";

interface HoverLabelOverlayHandle {
  setLabel: (label: string) => void;
  clear: () => void;
}

const HoverLabelOverlay = memo(
  forwardRef<HoverLabelOverlayHandle>(function HoverLabelOverlay(_, ref) {
    const [label, setLabel] = useState("");

    useImperativeHandle(
      ref,
      () => ({
        setLabel,
        clear: () => setLabel(""),
      }),
      []
    );

    if (!label) return null;

    return (
      <div className="pointer-events-none absolute left-1/2 top-20 z-[500] -translate-x-1/2 rounded-full border border-[#DDE8EF] bg-white/95 px-4 py-2 text-sm font-bold text-[#0A1628] shadow-[0_10px_24px_rgba(52,79,98,0.14)]">
        {label}
      </div>
    );
  })
);

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
  const layersByContinentRef = useRef<Record<string, L.Path[]>>({});
  const mapRef = useRef<L.Map | null>(null);
  const hoverLabelRef = useRef<HoverLabelOverlayHandle>(null);
  const isDraggingRef = useRef(false);

  const canvasRenderer = useMemo(
    () =>
      L.canvas({
        padding: 0.5,
      }),
    []
  );

  countriesRef.current = countries;
  isCountryLoadingRef.current = isCountryLoading;
  countryErrorMessageRef.current = countryErrorMessage;

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
    hoverLabelRef.current?.clear();
  }, [selectedContinent]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    const startMove = () => {
      isDraggingRef.current = true;
      hoverLabelRef.current?.clear();
    };

    const endMove = () => {
      window.setTimeout(() => {
        isDraggingRef.current = false;
      }, 0);
    };

    map.on("dragstart", startMove);
    map.on("zoomstart", startMove);
    map.on("movestart", startMove);
    map.on("dragend", endMove);
    map.on("zoomend", endMove);
    map.on("moveend", endMove);

    return () => {
      map.off("dragstart", startMove);
      map.off("zoomstart", startMove);
      map.off("movestart", startMove);
      map.off("dragend", endMove);
      map.off("zoomend", endMove);
      map.off("moveend", endMove);
    };
  }, [geoJson]);

  const styleFeature = (feature?: Feature<Geometry, GeoJsonProperties>) =>
    getCountryStyle(feature, selectedContinent, selectedCountry);

  const onEachCountry = (
    feature: Feature<Geometry, GeoJsonProperties>,
    layer: Layer
  ) => {
    const countryFeature = feature as CountryFeature;
    const pathLayer = layer as L.Path;
    const continent = countryFeature.properties.continent ?? "";
    const countryName = getFeatureCountryName(countryFeature);

    pathLayer.unbindTooltip();

    if (!selectedContinent) {
      const continentLayers = layersByContinentRef.current[continent] ?? [];

      layersByContinentRef.current[continent] = [
        ...continentLayers,
        pathLayer,
      ];
    }

    pathLayer.on({
      mouseover: () => {
        if (isDraggingRef.current) return;

        const nextLabel = selectedContinent
          ? countryName
          : continent_name_ko[continent] ?? continent;

        hoverLabelRef.current?.setLabel(nextLabel);

        if (!selectedContinent) {
          const continentLayers =
            layersByContinentRef.current[continent] ?? [];

          continentLayers.forEach((continentLayer) => {
            continentLayer.setStyle({
              fillOpacity: 0.76,
              weight: 0.55,
            });
          });

          return;
        }

        if (continent === selectedContinent) {
          pathLayer.setStyle({
            fillOpacity: 0.9,
            weight: 1.1,
          });
        }
      },

      mouseout: () => {
        if (isDraggingRef.current) return;

        hoverLabelRef.current?.clear();

        if (!selectedContinent) {
          const continentLayers =
            layersByContinentRef.current[continent] ?? [];

          continentLayers.forEach((continentLayer) => {
            continentLayer.setStyle({
              fillOpacity: 0.58,
              weight: 0.35,
            });
          });

          return;
        }

        if (continent === selectedContinent) {
          const isSelected = selectedCountry === countryName;

          pathLayer.setStyle({
            fillOpacity: isSelected ? 0.9 : 0.68,
            weight: isSelected ? 1.7 : 0.65,
            color: isSelected ? "#233044" : getContinentColor(continent),
          });
        }
      },

      click: () => {
        setNoticeMessage("");
        hoverLabelRef.current?.clear();

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
          setNoticeMessage(
            "국가 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
          );
          return;
        }

        if (latestCountries.length === 0) {
          setNoticeMessage(
            "국가 정보를 확인하는 중입니다. 잠시 후 다시 선택해 주세요."
          );
          return;
        }

        const supportedCountry = findSupportedCountry(
          latestCountries,
          countryFeature
        );

        if (!supportedCountry || supportedCountry.active === false) {
          setNoticeMessage(`${countryName}은 아직 준비 중인 국가입니다.`);
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
    hoverLabelRef.current?.clear();
    setNoticeMessage("");

    layersByContinentRef.current = {};
    mapRef.current?.setView(initial_position, initial_zoom);
  };

  const mapModeKey = selectedContinent
    ? `country-${selectedContinent}`
    : "continent-mode";

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

        .leaflet-tooltip {
          display: none !important;
        }
      `}</style>

      <div className="relative h-full min-h-0 w-full overflow-hidden">
        <MapHeader
          selectedContinent={selectedContinent}
          selectedCountry={selectedCountry}
          onReset={handleResetMap}
        />

        <MapNotice message={noticeMessage} />

        <HoverLabelOverlay ref={hoverLabelRef} />

        {!geoJson ? (
          <MapLoading />
        ) : (
          <MapContainer
            ref={mapRef}
            center={initial_position}
            zoom={initial_zoom}
            minZoom={2.2}
            maxZoom={6}
            maxBounds={map_bounds}
            maxBoundsViscosity={1}
            scrollWheelZoom
            zoomControl={false}
            preferCanvas
            renderer={canvasRenderer}
            className="z-10 h-full w-full"
          >
            <ZoomControl position="bottomleft" />

            <GeoJSON
              key={mapModeKey}
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
