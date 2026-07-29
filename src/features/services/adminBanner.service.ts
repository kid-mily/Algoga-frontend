import { adminApi, ApiResult, unwrapData } from "@/lib/api";
import {
  AdminBanner,
  AdminBannerApiRecord,
  BannerFileType,
  BannerFormData,
} from "@/features/csadmin/banner/types";

const formatDateTime = (value: string | undefined) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hour}:${minute}`;
};

const normalizeFileType = (value: string | undefined): BannerFileType => {
  return value === "VIDEO" ? "VIDEO" : "IMAGE";
};

const unwrapList = (data: unknown): AdminBannerApiRecord[] => {
  if (Array.isArray(data)) return data as AdminBannerApiRecord[];

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.content)) return record.content as AdminBannerApiRecord[];
    if (Array.isArray(record.banners)) return record.banners as AdminBannerApiRecord[];
    if (Array.isArray(record.items)) return record.items as AdminBannerApiRecord[];
  }

  return [];
};

export const normalizeBanner = (item: AdminBannerApiRecord): AdminBanner | null => {
  const bannerId = item.bannerId ?? item.id;

  if (
    typeof bannerId !== "number" ||
    !Number.isSafeInteger(bannerId) ||
    bannerId <= 0
  ) {
    return null;
  }

  return {
    bannerId,
    displayId: `B${String(bannerId).padStart(3, "0")}`,
    imageUrl: item.imageUrl ?? "",
    fileType: normalizeFileType(item.fileType),
    linkUrl: item.linkUrl ?? "",
    text: item.text ?? "-",
    isVisible: item.isVisible ?? item.visible ?? false,
    createdAt: formatDateTime(item.createdAt ?? item.created_at),
  };
};

const createBannerFormData = (
  formData: BannerFormData,
  file: File | null,
  bannerId?: number
) => {
  const multipart = new FormData();

  if (bannerId) {
    multipart.append("bannerId", String(bannerId));
  }

  multipart.append("linkUrl", formData.linkUrl.trim());
  multipart.append("text", formData.text.trim());
  multipart.append("isVisible", String(formData.isVisible));

  if (file) {
    multipart.append("image", file);
  }

  return multipart;
};

export const getAdminBanners = async (
  signal?: AbortSignal
): Promise<AdminBanner[]> => {
  const response = await adminApi.get<ApiResult<unknown>>(
    "/api/v1/banner/admin/all",
    {
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return unwrapList(data).flatMap((item) => {
    const banner = normalizeBanner(item);

    return banner ? [banner] : [];
  });
};

export const getAdminBannerById = async (
  bannerId: number,
  signal?: AbortSignal
): Promise<AdminBanner | null> => {
  const response = await adminApi.get<ApiResult<AdminBannerApiRecord | null>>(
    `/api/v1/banner/admin/${bannerId}`,
    {
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return data ? normalizeBanner(data) : null;
};

export const registerAdminBanner = async (
  formData: BannerFormData,
  file: File | null
): Promise<void> => {
  await adminApi.post<ApiResult<{ bannerId: number }>>(
    "/api/v1/banner/admin/register",
    createBannerFormData(formData, file)
  );
};

export const modifyAdminBanner = async (
  bannerId: number,
  formData: BannerFormData,
  file: File | null
): Promise<void> => {
  await adminApi.put<ApiResult<{ bannerId: number }>>(
    "/api/v1/banner/admin/modify",
    createBannerFormData(formData, file, bannerId)
  );
};

export const deleteAdminBanner = async (bannerId: number): Promise<void> => {
  await adminApi.delete<ApiResult<null>>(`/api/v1/banner/admin/delete/${bannerId}`);
};


