import PaymentSuccess from "@/features/packagelounge/components/PaymentSuccess";
import { buildPaymentSuccessData } from "@/features/packagelounge/paymentSuccess.data";
import type { PaymentMethod } from "@/features/packagelounge/paymentSuccess.types";

interface PackagePaymentSuccessPageProps {
  searchParams: Promise<{ mode?: string }>;
}

// 패키지 결제 완료 페이지 (디자인 확인용 더미 예약 데이터)
export default async function PackagePaymentSuccessPage({
  searchParams,
}: PackagePaymentSuccessPageProps) {
  const { mode } = await searchParams;
  const paymentMode: PaymentMethod = mode === "deposit" ? "분할 결제" : "일시불";
  const data = buildPaymentSuccessData(paymentMode);

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
      <PaymentSuccess data={data} />
    </main>
  );
}
