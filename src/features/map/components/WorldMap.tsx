'use client'
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import { getCountries } from "@/features/services/countrySelect.service";
import { Country } from "@/features/classroom/components/types";
interface GeoJsonFeature {
  properties: {
    continent?: string;
    name?: string;
    name_ko?: string;
  };
  geometry: any;
}
export default function WorldMap() {
  const router = useRouter();
  const [rawGeoJson, setRawGeoJson] = useState<any>(null);
  const [selectedContinent, setSelectedContinent] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [layersByContinent, setLayersByContinent] = useState<{ [key: string]: any[] }>({});
  const [backendCountries, setBackendCountries] = useState<Country[]>([]);
  const backendCountriesRef = useRef<Country[]>([]);
  const mapRef = useRef<L.Map | null>(null)
  const position: [number, number] = [30, 10];
  const bounds = L.latLngBounds([-85, -180], [85, 180])
  const continentNameKo: Record<string, string> = {
    Asia: '아시아',
    Europe: '유럽',
    Africa: '아프리카',
    'North America': '북아메리카',
    'South America': '남아메리카',
    Oceania: '오세아니아',
  }
  const continentCodeMap: Record<string, string> = {
    Asia: 'ASIA',
    Europe: 'EUROPE',
    Africa: 'AFRICA',
    'North America': 'NORTH_AMERICA',
    'South America': 'SOUTH_AMERICA',
    Oceania: 'OCEANIA',
  };
  useEffect(() => {
    fetch('/data/world.geo.json')
      .then((res) => res.json())
      .then((data) => setRawGeoJson(data))
      .catch((err) => console.error("데이터 로드 실패:", err));
  }, []);
  useEffect(() => {
    if (!selectedContinent) {
      setBackendCountries([]);
      backendCountriesRef.current = [];
      return;
    }
    const code = continentCodeMap[selectedContinent];
    if (!code) return;
    getCountries(code).then((data) => {
      setBackendCountries(data);
      backendCountriesRef.current = data;
    }).catch(() => {});
  }, [selectedContinent]);
  useEffect(() => {
    setLayersByContinent({});
  }, [selectedContinent, selectedCountry]);
  const countries = rawGeoJson?.features
      ?.filter(
        (country: any) =>
          country.properties.continent === selectedContinent)
      ?.map((country: any) => ({
        name:
          country.properties.name_ko ||
          country.properties.name,
        image:
          '/images/sample.jpg',
        lectures:
          Math.floor(
            Math.random() * 10
          ) + 1,
      })) || []
  const getColor = (continent: string) => {
      const colors: Record<string, string> = {
        Asia: '#439A97',
        Europe: '#3A86FF',
        Africa: '#FF006E',
        'North America': '#FFBE0B',
        'South America': '#FB5607',
        Oceania: '#8338EC',
      }
      return (colors[continent] || '#94A3B8')
    };
  const styleFeature = (feature: any) => {
    const continent = feature.properties.continent;
    const countryName = feature.properties.name_ko || feature.properties.name;
    if (selectedContinent) {
      if (continent === selectedContinent) {
        const isSelected = selectedCountry === countryName;
        return {
          fillColor: getColor(continent),
          weight: isSelected ? 1.5 : 0.4,
          color: isSelected ? "#2C3E50" : getColor(continent),
          fillOpacity: isSelected ? 0.85 : 0.6,
        };
      } else {
        return {
          fillColor: "#CBD5E1",
          weight: 0.1,
          color: "#CBD5E1",
          fillOpacity: 0.08,
        };
      }
    }
    return {
      fillColor: getColor(continent),
      weight: 0.2,
      color: getColor(continent),
      fillOpacity: 0.5,
    };
  };
  const onEachCountry = (feature: any, layer: any) => {
    const continent = feature.properties.continent || '기타';
    const countryName = feature.properties.name_ko || feature.properties.name;
    if (!selectedContinent) {
      if (!layersByContinent[continent]) {
        layersByContinent[continent] = [];
      }
      layersByContinent[continent].push(layer);
    }
    const tooltipText = selectedContinent ? countryName : (continentNameKo[continent] || continent);
    layer.bindTooltip(tooltipText, { direction: 'top', sticky: true });
    layer.on({
      mouseover: () => {
        layer._path.style.cursor = 'pointer';
        if (!selectedContinent) {
          const dynamicLayers = layersByContinent[continent] || [];
          dynamicLayers.forEach((l) => {
            l.setStyle({ fillOpacity: 0.7 });
          });
        } else if (continent === selectedContinent) {
          layer.setStyle({ fillOpacity: 0.85 });
        }
      },
      mouseout: () => {
        if (!selectedContinent) {
          const dynamicLayers = layersByContinent[continent] || [];
          dynamicLayers.forEach((l) => {
            l.setStyle({ fillOpacity: 0.5 });
          });
        } else if (continent === selectedContinent) {
          layer.setStyle({
            fillOpacity: selectedCountry === countryName ? 0.85 : 0.6,
            weight: selectedCountry === countryName ? 1.5 : 0.4,
            color: selectedCountry === countryName ? "#2C3E50" : getColor(continent)
          });
        }
      },
      click: () => {
        if (!selectedContinent) {
          setSelectedContinent(continent);
          setSelectedCountry('');
          if (mapRef.current) {
            mapRef.current.fitBounds(layer.getBounds(), { padding: [40, 40] });
          }
        } else if (continent === selectedContinent) {
          setSelectedCountry(countryName);
          const matched = backendCountriesRef.current.find(
            (c) => c.countryName === countryName
          );
          if (matched) {
            const continentUrl = continentCodeMap[continent]?.toLowerCase() || continent.toLowerCase();
            router.push(`/classroom/${continentUrl}/${matched.countryCode.toLowerCase()}`);
          }
        }
      }
    });
  };
  return (
  <>
  <div className="w-full h-full flex flex-col">
      <style jsx global>{`
      .leaflet-interactive:focus {
      outline: none;
      }
      `}
      </style>
      <div className="flex items-center justify-between p-4 border-b bg-white z-[1000]">
        <div className="text-sm font-semibold text-gray-600">
          {!selectedContinent
            ? '대륙을 선택하세요'
            : selectedCountry
            ? `${selectedCountry}`
            : `${selectedContinent} 국가 선택`}
        </div>
        <div>
          {selectedContinent && (
            <button
              onClick={() => {
                setSelectedContinent('');
                setSelectedCountry('');
                if (mapRef.current) {
                  mapRef.current.setView(position, 2.3);
                }
              }}
              className="px-4 py-2 bg-white text-gray-700 font-semibold text-xs rounded-lg shadow-md border border-gray-200 hover:bg-gray-50"
            >
              대륙 보기
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden w-full h-[500px]">
        {!rawGeoJson ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
            지도를 구성 중입니다...
          </div>
        ) : (
          <MapContainer
            ref={mapRef}
            center={position}
            zoom={2.3}
            minZoom={2}
            maxBounds={bounds}
            maxBoundsViscosity={1.0}
            scrollWheelZoom
            className="w-full h-full z-10"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              noWrap={true}
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
    </div>
  </>
)
}
