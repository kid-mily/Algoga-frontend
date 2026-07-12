import PackagePaymentClient from "@/features/packagelounge/components/PackagePaymentClient";
import { PACKAGE_DETAIL_DATA } from "@/features/packagelounge/packageDetail.data";

interface PackagePaymentPageProps {
  params: Promise<{ packageId: string }>;
}

// 패키지 결제 페이지 (디자인 확인용 더미 상품 데이터, 토스페이먼츠 결제 요청은 실제 함수를 사용)
export default async function PackagePaymentPage({
  params,
}: PackagePaymentPageProps) {
  const { packageId } = await params;
  const data = PACKAGE_DETAIL_DATA;

  return <PackagePaymentClient data={data} packageId={packageId} />;
}
