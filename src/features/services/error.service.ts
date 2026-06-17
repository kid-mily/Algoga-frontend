import axios from "axios";
import { ApiRequestError } from "@/lib/api";

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

export const getErrorMessage = (
  error: unknown,
  fallbackMessage: string
) => {
  if (error instanceof ApiRequestError) {
    return error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
};

export const isAbortError = (error: unknown) => {
  return error instanceof DOMException && error.name === "AbortError";
};
