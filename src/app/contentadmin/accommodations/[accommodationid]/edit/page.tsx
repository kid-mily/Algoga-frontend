import type { Metadata } from "next";
import SubHeader from "@/features/common/components/SubHeader";
import AccommodationFormClient from "@/features/contentmanage/package/components/AccommodationFormClient";

interface EditAccommodationPageProps {
  params: Promise<{
    accommodationid: string;
  }>;
}

export const metadata: Metadata = {
  title: "숙소 수정 | 알고가 관리자",
  description: "패키지 구성에 사용할 숙소 정보를 수정합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditAccommodationPage({
  params,
}: EditAccommodationPageProps) {
  const { accommodationid } = await params;

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/accommodations"
        backText="숙소 관리로 돌아가기"
        title="숙소 수정"
        description="패키지 구성에 사용할 숙소 정보를 수정합니다"
      />

      <section className="mt-6">
        <AccommodationFormClient mode="edit" accommodationId={accommodationid} />
      </section>
    </main>
  );
}
