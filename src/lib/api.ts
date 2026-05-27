import axios from "axios";

export const api = axios.create({
  baseURL: "https://kidmily.kro.kr",
  headers: {
    "Content-Type": "application/json",
  },
});