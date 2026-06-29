"use client";

import { useEffect, useState } from "react";
import type { GeoJsonObject } from "geojson";

let cachedWorldGeoJson: GeoJsonObject | null = null;
let pendingWorldGeoJson: Promise<GeoJsonObject> | null = null;

const WORLD_GEO_JSON_URL = "/data/world.geo.json";

export function preloadWorldGeoJson() {
  if (cachedWorldGeoJson) {
    return Promise.resolve(cachedWorldGeoJson);
  }

  if (pendingWorldGeoJson) {
    return pendingWorldGeoJson;
  }

  pendingWorldGeoJson = fetch(WORLD_GEO_JSON_URL, {
    cache: "force-cache",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("지도 데이터를 불러오지 못했습니다.");
      }

      return response.json() as Promise<GeoJsonObject>;
    })
    .then((data) => {
      cachedWorldGeoJson = data;
      return data;
    })
    .finally(() => {
      pendingWorldGeoJson = null;
    });

  return pendingWorldGeoJson;
}

export function useWorldGeoJson() {
  const [geoJson, setGeoJson] = useState<GeoJsonObject | null>(
    cachedWorldGeoJson
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (cachedWorldGeoJson) {
      setGeoJson(cachedWorldGeoJson);
      return;
    }

    let active = true;

    preloadWorldGeoJson()
      .then((data) => {
        if (!active) return;

        setGeoJson(data);
      })
      .catch((error) => {
        if (!active) return;

        console.error("[map] 지도 데이터 로드 실패:", error);
        setErrorMessage("지도 데이터를 불러오지 못했습니다.");
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    geoJson,
    errorMessage,
  };
}