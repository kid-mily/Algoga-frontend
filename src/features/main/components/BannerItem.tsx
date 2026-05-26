import Link from "next/link";

interface BannerProps {
  banner: {
    id: number;
    imageUrl: string;
    linkUrl: string;
  };
}


export default function BannerItem({ banner }: BannerProps) {
  return (
    <Link href={banner.linkUrl}>
      <img src={banner.imageUrl} alt="배너" className="w-full h-full object-cover" />
    </Link>
  );
}