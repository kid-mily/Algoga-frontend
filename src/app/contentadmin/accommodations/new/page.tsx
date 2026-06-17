import type { Metadata } from "next";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import AccommodationFormClient from "@/features/contentmanage/package/components/AccommodationFormClient";

export const metadata: Metadata = {
  title: "숙소 등록 | 알고가 관리자",
  description: "패키지 구성에 사용할 새 숙소를 등록합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateAccommodationPage() {
  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/accommodations"
        backText="숙소 관리로 돌아가기"
        title="숙소 등록"
        description="패키지 구성에 사용할 숙소를 등록합니다"
      />

      <section className="mt-6">
        <AccommodationFormClient mode="create" />
      </section>
    </main>
  );
}
