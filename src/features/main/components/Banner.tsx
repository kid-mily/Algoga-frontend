import { getMainBanners } from "@/features/services/banner.service";
import BannerSlider from "./BannerSlider";

export default async function Banner() {
  const banners = await getMainBanners();

  return <BannerSlider banners={banners} />;
}