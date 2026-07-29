import PaymentSuccessClient from "@/features/packagelounge/components/PaymentSuccessClient";
import type { PaymentMethod } from "@/features/packagelounge/paymentSuccess.types";
import { toPackageDetailData } from "@/features/packagelounge/packageDetail.util";
import { getPackageLoungeDetail } from "@/features/services/package.service";
import { getCourseDetail } from "@/features/services/lectureDetail.service";
import type { CourseItem } from "@/features/classroom/components/types";

interface PackagePaymentSuccessPageProps {
  params: Promise<{ packageId: string }>;
  searchParams: Promise<{
    mode?: string;
    bookingId?: string;
    courseId?: string;
    amount?: string;
  }>;
}

// 패키지 결제 완료 페이지.
// 패키지/강의 정보(공개 데이터)는 서버에서 조회하고, 실제 결제된 예약(로그인 유저 전용
// 데이터)은 PaymentSuccessClient가 클라이언트에서 직접 조회한다 (브라우저 쿠키가 자동으로 실리도록)
export default async function PackagePaymentSuccessPage({
  params,
  searchParams,
}: PackagePaymentSuccessPageProps) {
  const { packageId } = await params;
  const { mode, bookingId, courseId, amount } = await searchParams;
  const paymentMode: PaymentMethod = mode === "deposit" ? "분할 결제" : "일시불";

  const detail = await getPackageLoungeDetail(packageId);
  const data = toPackageDetailData(detail);

  let course: CourseItem | null = null;
  if (courseId) {
    course = await getCourseDetail(detail.countryId, courseId);
  }

  if (!bookingId) {
    // usePackagePayment는 항상 bookingId를 붙여서 이동시키지만, 혹시 없이 들어온 경우를 위한 안내
    return (
      <main className="min-h-screen bg-[#F3F8FC] px-4 py-16">
        <section className="mx-auto w-full max-w-xl rounded-2xl border border-[#E1E8EF] bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#172235]">
            예약 정보를 확인할 수 없습니다. 마이페이지 예약 내역에서 확인해 주세요.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F8FC] px-4 py-10 sm:px-6 lg:px-8">
      <PaymentSuccessClient
        packageData={data}
        course={course}
        paymentMode={paymentMode}
        bookingId={bookingId}
        paidAmount={amount ? Number(amount) : null}
      />
    </main>
  );
}
