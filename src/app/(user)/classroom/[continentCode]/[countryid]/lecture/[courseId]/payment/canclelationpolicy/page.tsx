import CancellationPolicyClient from "@/features/payment/CancellationPolicyClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CanclelationPolicy() {
    return <CancellationPolicyClient />;
}