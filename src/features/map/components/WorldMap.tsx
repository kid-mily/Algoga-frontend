'use client'

import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from "react";
import L from "leaflet";

interface GeoJsonFeature {
  properties: {
    continent?: string;
    name?: string;
    name_ko?: string;
  };
  geometry: any;
}

export default function WorldMap() {
  const [rawGeoJson, setRawGeoJson] = useState<any>(null);    // 세계 국가 전체 데이터 저장
  const [selectedContinent, setSelectedContinent] = useState<string>('');   // 현재 선택된 대륙 저장
  const [selectedCountry, setSelectedCountry] = useState<string>('');   // 현재 선택된 나라 저장
  const [layersByContinent, setLayersByContinent] = useState<{ [key: string]: any[] }>({});   // 대륙별 나라 레이어 묶음 저장  // 같은 대륙 내 서로 다른 나라를 눌렀을 때 다른 나라들도 같이 반응시켜야 하기 때문
  const mapRef = useRef<L.Map | null>(null)

  // 초기 위치 
  const position: [number, number] = [30, 10];
  // 지도 이동 제한
  const bounds = L.latLngBounds([-85, -180], [85, 180])

  // 대륙 한글명
  const continentNameKo: Record<string, string> = {
    Asia: '아시아',
    Europe: '유럽',
    Africa: '아프리카',
    'North America': '북아메리카',
    'South America': '남아메리카',
    Oceania: '오세아니아',
  }

  // GeoJSON 로드
  useEffect(() => {
    fetch('/data/world.geo.json')
      .then((res) => res.json())
      .then((data) => setRawGeoJson(data))
      .catch((err) => console.error("데이터 로드 실패:", err));
  }, []);

  useEffect(() => {
    setLayersByContinent({});
  }, [selectedContinent, selectedCountry]);

  // 현재 대륙 국가 목록
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

  // 대륙별 색상 지정
  const getColor = (continent: string) => {
      const colors: Record<string, string> = {
        Asia: '#439A97',
      Europe: '#3A86FF',
      Africa: '#FF006E',
      'North America': '#FFBE0B',
      'South America': '#FB5607',
      Oceania: '#8338EC',
      }

      return (
        colors[continent] || '#94A3B8'
      )
    };

  // 지도
  // 대륙일 때 국경선 안 보이게
  const styleFeature = (feature: any) => {
    const continent = feature.properties.continent;
    const countryName = feature.properties.name_ko || feature.properties.name;

    if (selectedContinent) {
      if (continent === selectedContinent) {
        const isSelected = selectedCountry === countryName;
        return {
          fillColor: getColor(continent),
          weight: isSelected ? 1.5 : 0.4,
          // 대륙에 진입한 후에도 자잘한 국경선은 대륙색으로 덮어 숨김
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

    // 대륙 전체
    // 테두리 선 색상을 대륙의 면 색상(fillColor)과 완벽히 일치시키고
    // 선 두께(weight)를 최소화하여 내부의 국가 경계선들이 지워지도록 만든다.
    return {
      fillColor: getColor(continent),
      weight: 0.2,                  
      color: getColor(continent), // 대륙 색상으로 경계 삭제
      fillOpacity: 0.5,
    };
  };

  // 나라별 이벤트 등록
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
          // 대륙 선택 전 호버: 해당 대륙에 소속된 전 레이어의 불투명도를 동시에 조절
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
        // 처음 상태
        if (!selectedContinent) {
          setSelectedContinent(continent);
          setSelectedCountry('');

          // 클릭한 대륙으로 확대
          if (mapRef.current) {
            mapRef.current.fitBounds(
              layer.getBounds(),
              {
                padding: [40, 40],
              }
            );
          }
        }
      }
    });
  };

  return (
  <>
  <div className="w-full h-full flex flex-col">
    {/* Leaflet 기본 outline 제거
        Leaflet은 클릭 시 outline이 생김 */}
      <style jsx global>{`
      .leaflet-interactive:focus {
      outline: none;
      }
      `}
      </style>
      
      {/* 상단 버튼 영역 */}
      <div className="flex items-center justify-between p-4 border-b bg-white z-[1000]">

        {/* 왼쪽 텍스트 */}
        <div className="text-sm font-semibold text-gray-600">
          {!selectedContinent
            ? '대륙을 선택하세요'
            : selectedCountry
            ? `${selectedCountry}`
            : `${selectedContinent} 국가 선택`}
        </div>

        {/* 오른쪽 버튼 */}
        <div>
          {selectedContinent && (
            <button
              onClick={() => {
                setSelectedContinent('');
                setSelectedCountry('');
                
                // 지도 원래 위치로 복귀
                if (mapRef.current) {
                  mapRef.current.setView(
                    position,
                    2.3
                  );
                }
              }}
              className="px-4 py-2 bg-white text-gray-700 font-semibold text-xs rounded-lg shadow-md border border-gray-200 hover:bg-gray-50"
            >
              대륙 보기
            </button>
          )}
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 overflow-hidden w-full h-[500px]">

        {!rawGeoJson ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
            지도를 구성 중입니다...
          </div>
        ) : (

          // Leaflet 지도 생성
          <MapContainer
          ref={mapRef}
            center={position} // 초기 지도 위치
            zoom={2.3} // 초기 확대 정도
            minZoom={2}
            maxBounds={bounds} // 지도 이동 제한
            maxBoundsViscosity={1.0}
            scrollWheelZoom 
            className="w-full h-full z-10"
          >

            {/* 지도 배경 */}
            {/* CartoDB light_nolabels: 라벨 없는 깔끔한 지도 */}
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap={true}
            />

            {/* 나라 데이터 */}
            <GeoJSON
              key={`${selectedContinent}-${selectedCountry}`}   // 강제 리렌더링
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