import L from "leaflet";

export const initial_position: [number, number] = [30, 10];

export const initial_zoom = 2.3;

export const map_bounds = L.latLngBounds([-85, -180], [85, 180]);

export const continent_name_ko: Record<string, string> = {
  Asia: "아시아",
  Europe: "유럽",
  Africa: "아프리카",
  "North America": "북아메리카",
  "South America": "남아메리카",
  Oceania: "오세아니아",
  Antarctica: "남극",
};

export const continent_code_map: Record<string, string> = {
  Asia: "ASIA",
  Europe: "EUROPE",
  Africa: "AFRICA",
  "North America": "NORTH_AMERICA",
  "South America": "SOUTH_AMERICA",
  Oceania: "OCEANIA",
  Antarctica: "ANTARCTICA",
};

export const continent_color_map: Record<string, string> = {
  Asia: "#439A97",
  Europe: "#3A86FF",
  Africa: "#D88C3A",
  "North America": "#E3B341",
  "South America": "#E66B5B",
  Oceania: "#7C6FD6",
  Antarctica: "#94A3B8",
};

export const default_map_color = "#94A3B8";
export const disabled_map_color = "#CBD5E1";
