import { getMainBanners } from "@/features/services/banner.service";
import BannerSlider from "./BannerSlider";

export default async function Banner() {
  // getMainBanners() 호출이 실패하면 전체 페이지 렌더링이 중단됨
  try {
    const banners = await getMainBanners();
    return <BannerSlider banners={banners} />
  } catch (error) {
    console.error('배너 데이터 로드 실패:', error);
    return <BannerSlider banners={[]} />
  }
}