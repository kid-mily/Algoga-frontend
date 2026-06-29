import PaymentCompleteClient from "@/features/payment/PaymentCompleteClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function PaymentCompletePage() {
  return <PaymentCompleteClient />;
}