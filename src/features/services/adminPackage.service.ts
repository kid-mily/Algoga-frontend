import {
  Accommodation,
  AccommodationPayload,
  Flight,
  FlightSearchParams,
  normalizeAccommodation,
  normalizeFlight,
} from "@/features/contentmanage/package/types";
import { adminApi, api, ApiResult, unwrapData } from "@/lib/api";

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
  countryId: string | number,
  signal?: AbortSignal
): Promise<Accommodation[]> => {
  const response = await api.get<ApiResult<unknown>>(
    `/api/v1/countries/${countryId}/accommodations`,
    { signal }
  );
  const data = unwrapData(response);

  return unwrapList(data).map((item, index) =>
    normalizeAccommodation(item, index + 1)
  );
};

export const getAccommodation = async (
  accommodationId: string | number,
  signal?: AbortSignal
): Promise<Accommodation> => {
  const response = await api.get<ApiResult<unknown>>(
    `/api/v1/accommodations/${accommodationId}`,
    { signal }
  );
  const data = unwrapData(response);

  return normalizeAccommodation(data, Number(accommodationId));
};

export const createAccommodation = async (
  payload: AccommodationPayload,
  signal?: AbortSignal
) => {
  const response = await adminApi.post<ApiResult<unknown>>(
    "/api/v1/admin/accommodations",
    buildAccommodationFormData(payload),
    { signal }
  );

  return unwrapData(response);
};

export const updateAccommodation = async (
  accommodationId: string | number,
  payload: AccommodationPayload,
  signal?: AbortSignal
) => {
  const response = await adminApi.put<ApiResult<unknown>>(
    `/api/v1/admin/accommodations/${accommodationId}`,
    buildAccommodationFormData(payload),
    { signal }
  );

  return unwrapData(response);
};

export const deleteAccommodation = async (accommodationId: string | number) => {
  const response = await adminApi.delete<ApiResult<unknown>>(
    `/api/v1/admin/accommodations/${accommodationId}`
  );

  return unwrapData(response);
};

export const searchFlights = async (
  params: FlightSearchParams,
  signal?: AbortSignal
): Promise<Flight[]> => {
  const response = await api.get<ApiResult<unknown>>(
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
      signal,
    }
  );
  const data = unwrapData(response);

  return unwrapList(data).map((item, index) => normalizeFlight(item, index + 1));
};
