export type BannerFileType = "IMAGE" | "VIDEO";

export type AdminBannerApiRecord = {
  bannerId?: number;
  id?: number;
  imageUrl?: string;
  fileType?: BannerFileType | string;
  linkUrl?: string;
  text?: string;
  isVisible?: boolean;
  visible?: boolean;
  createdAt?: string;
  created_at?: string;
};

export type AdminBanner = {
  bannerId: number;
  displayId: string;
  imageUrl: string;
  fileType: BannerFileType;
  linkUrl: string;
  text: string;
  isVisible: boolean;
  createdAt: string;
};

export type BannerFormData = {
  text: string;
  linkUrl: string;
  fileType: BannerFileType;
  isVisible: boolean;
};
