import L from "leaflet";

export const INITIAL_POSITION: [number, number] = [30, 10];

export const INITIAL_ZOOM = 2.3;

export const MAP_BOUNDS = L.latLngBounds([-85, -180], [85, 180]);

export const CONTINENT_NAME_KO: Record<string, string> = {
    Asia: "아시아",
    Europe: "유럽",
    Africa: "아프리카",
    "North America": "북아메리카",
    "South America": "남아메리카",
    Oceania: "오세아니아",
    Antarctica: "남극",
};

export const CONTINENT_CODE_MAP: Record<string, string> = {
    Asia: "ASIA",
    Europe: "EUROPE",
    Africa: "AFRICA",
    "North America": "NORTH_AMERICA",
    "South America": "SOUTH_AMERICA",
    Oceania: "OCEANIA",
    Antarctica: "ANTARCTICA",
};

export const CONTINENT_COLOR_MAP: Record<string, string> = {
    Asia: "#439A97",
    Europe: "#3A86FF",
    Africa: "#D88C3A",
    "North America": "#E3B341",
    "South America": "#E66B5B",
    Oceania: "#7C6FD6",
    Antarctica: "#94A3B8",
};

export const DEFAULT_MAP_COLOR = "#94A3B8";
export const DISABLED_MAP_COLOR = "#CBD5E1";