import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (typeof window !== "undefined") {
      if (status === 400) {
        window.location.href = "/error/400";
      } else if (status === 500) {
        window.location.href = "/error/500";
      }
    }

    return Promise.reject(error);
  }
);