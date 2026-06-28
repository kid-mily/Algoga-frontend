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

const unwrapBannerList = (data: unknown): BannerApiRecord[] => {
  if (Array.isArray(data)) return data as BannerApiRecord[];

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.content)) return record.content as BannerApiRecord[];
    if (Array.isArray(record.banners)) return record.banners as BannerApiRecord[];
    if (Array.isArray(record.items)) return record.items as BannerApiRecord[];
  }

  return [];
};

const normalizeBanner = (item: BannerApiRecord): Banner | null => {
  const bannerId = item.bannerId ?? item.id;

  if (
    typeof bannerId !== "number" ||
    !Number.isSafeInteger(bannerId) ||
    bannerId <= 0
  ) {
    return null;
  }

  if (!item.imageUrl) {
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
