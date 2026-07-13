import type {
  AccommodationResponse,
  PackageApiItem,
  PackageLoungeDetail,
} from "@/features/packagelounge/types";
import { api, type ApiResult, unwrapData } from "@/lib/api";

export async function getPackageDetail(
  packageId: string | number,
  signal?: AbortSignal
): Promise<PackageApiItem> {
  const response = await api.get<ApiResult<PackageApiItem>>(
    `/api/v1/packages/${packageId}`,
    {
      signal,
      skipAuth: true,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return unwrapData(response);
}

export async function getAccommodationDetail(
  accommodationId: string | number,
  signal?: AbortSignal
): Promise<AccommodationResponse> {
  const response = await api.get<ApiResult<AccommodationResponse>>(
    `/api/v1/accommodations/${accommodationId}`,
    {
      signal,
      skipAuth: true,
      suppressGlobalError: true,
      cache: "no-store",
    }
  );

  return unwrapData(response);
}

export async function getPackageLoungeDetail(
  packageId: string | number,
  signal?: AbortSignal
): Promise<PackageLoungeDetail> {
  const packageItem = await getPackageDetail(packageId, signal);
  const accommodation = await getAccommodationDetail(
    packageItem.accommodationId,
    signal
  );

  return { packageItem, accommodation };
}
