import {
  Accommodation,
  AccommodationPayload,
  Flight,
  FlightSearchParams,
  normalizeAccommodation,
  normalizeFlight,
} from "@/features/contentmanage/package/types";
import { adminApi, api, ApiResponse } from "@/lib/api";

type PackageApiResponse<T> = ApiResponse<T> | T;

const unwrapData = <T>(response: PackageApiResponse<T>): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiResponse<T>).data;
  }

  return response as T;
};

const unwrapList = (data: unknown) => {
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.content)) return record.content;
    if (Array.isArray(record.items)) return record.items;
    if (Array.isArray(record.accommodations)) return record.accommodations;
    if (Array.isArray(record.flights)) return record.flights;
  }

  return [];
};

const buildAccommodationFormData = (payload: AccommodationPayload) => {
  const formData = new FormData();
  const { image, ...data } = payload;

  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (image) {
    formData.append("image", image);
  }

  return formData;
};

export const getCountryAccommodations = async (
  countryId: string | number
): Promise<Accommodation[]> => {
  const response = await api.get<PackageApiResponse<unknown>>(
    `/api/v1/countries/${countryId}/accommodations`
  );
  const data = unwrapData(response);

  return unwrapList(data).map((item, index) =>
    normalizeAccommodation(item, index + 1)
  );
};

export const getAccommodation = async (
  accommodationId: string | number
): Promise<Accommodation> => {
  const response = await api.get<PackageApiResponse<unknown>>(
    `/api/v1/accommodations/${accommodationId}`
  );
  const data = unwrapData(response);

  return normalizeAccommodation(data, Number(accommodationId));
};

export const createAccommodation = async (payload: AccommodationPayload) => {
  const response = await adminApi.post<PackageApiResponse<unknown>>(
    "/api/v1/admin/accommodations",
    buildAccommodationFormData(payload)
  );

  return unwrapData(response);
};

export const updateAccommodation = async (
  accommodationId: string | number,
  payload: AccommodationPayload
) => {
  const response = await adminApi.put<PackageApiResponse<unknown>>(
    `/api/v1/admin/accommodations/${accommodationId}`,
    buildAccommodationFormData(payload)
  );

  return unwrapData(response);
};

export const deleteAccommodation = async (accommodationId: string | number) => {
  const response = await adminApi.delete<PackageApiResponse<unknown>>(
    `/api/v1/admin/accommodations/${accommodationId}`
  );

  return unwrapData(response);
};

export const searchFlights = async (
  params: FlightSearchParams
): Promise<Flight[]> => {
  const response = await api.get<PackageApiResponse<unknown>>(
    "/api/v1/public/flights/search",
    {
      params: {
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        returnDate: params.returnDate || undefined,
        adults: params.adults || 1,
      },
      skipAuth: true,
    }
  );
  const data = unwrapData(response);

  return unwrapList(data).map((item, index) => normalizeFlight(item, index + 1));
};
