  import Link from "next/link";
import { Banner } from "./types";

  interface BannerProps {
    banner: Banner;
    };
  
  export default function BannerItem({ banner }: BannerProps) {
    return (
      <Link href={banner.linkUrl}>
        <img src={banner.imageUrl} alt="배너" className="w-full h-50 object-cover" />
      </Link>
    );
  }