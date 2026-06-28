"use client";

import { useEffect, useState } from "react";
import { GeoJsonObject } from "geojson";

export function useWorldGeoJson() {
    const [geoJson, setGeoJson] = useState<GeoJsonObject | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let active = true;

        const loadGeoJson = async () => {
        try {
            const response = await fetch("/data/world.geo.json", {
                cache: "force-cache",
            });

            if (!response.ok) {
            throw new Error("지도 데이터를 불러오지 못했습니다.");
            }

            const data = (await response.json()) as GeoJsonObject;

            if (!active) return;

            setGeoJson(data);
        } catch (error) {
            if (!active) return;

            console.error("[map] 지도 데이터 로드 실패:", error);
            setErrorMessage("지도 데이터를 불러오지 못했습니다.");
        }
        };

        void loadGeoJson();

        return () => {
        active = false;
        };
    }, []);

    return {
        geoJson,
        errorMessage,
    };
}