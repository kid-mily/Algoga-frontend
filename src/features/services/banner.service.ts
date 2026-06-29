import { api, ApiResponse } from "@/lib/api";
import type { Banner } from "@/features/main/banner/types";

type BannerApiRecord = {
  bannerId?: number;
  id?: number;
  imageUrl?: string;
  linkUrl?: string;
  text?: string;
  isVisible?: boolean;
  visible?: boolean;
};

const isBannerApiRecord = (value: unknown): value is BannerApiRecord => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const unwrapBannerList = (data: unknown): BannerApiRecord[] => {
  const toBannerRecords = (items: unknown[]) =>
    items.filter(isBannerApiRecord);

  if (Array.isArray(data)) {
    return toBannerRecords(data);
  }

  if (isBannerApiRecord(data)) {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.content)) return toBannerRecords(record.content);
    if (Array.isArray(record.banners)) return toBannerRecords(record.banners);
    if (Array.isArray(record.items)) return toBannerRecords(record.items);
  }

  return [];
};

const normalizeBanner = (item: unknown): Banner | null => {
  if (!isBannerApiRecord(item)) {
    return null;
  }

  const bannerId = item.bannerId ?? item.id;

  if (
    typeof bannerId !== "number" ||
    !Number.isSafeInteger(bannerId) ||
    bannerId <= 0
  ) {
    return null;
  }

  if (typeof item.imageUrl !== "string" || item.imageUrl.trim().length === 0) {
    return null;
  }

  return {
    bannerId,
    imageUrl: item.imageUrl,
    linkUrl: item.linkUrl ?? "/",
    text: item.text ?? "메인 배너",
  };
};

export const getMainBanners = async (): Promise<Banner[]> => {
  try {
    const response = await api.get<ApiResponse<unknown>>("/api/v1/banner", {
      next: { revalidate: 1800 },
      suppressGlobalError: true,
    });

    return unwrapBannerList(response.data).flatMap((item) => {
      const banner = normalizeBanner(item);
      return banner ? [banner] : [];
    });
  } catch (error) {
    console.error("[banner] 메인 배너 조회 실패:", error);
    return [];
  }
};