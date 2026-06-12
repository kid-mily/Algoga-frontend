import type { Metadata } from "next";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import AccommodationFormClient from "@/features/contentmanage/package/components/AccommodationFormClient";

interface EditPackagePageProps {
  params: Promise<{
    packageid: string;
  }>;
}

export const metadata: Metadata = {
  title: "숙소 수정 | 알고가 관리자",
  description: "패키지 구성에 사용할 숙소 정보를 수정합니다.",
};

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const { packageid } = await params;

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/package"
        backText="패키지 관리로 돌아가기"
        title="숙소 수정"
        description="패키지 구성에 사용할 숙소 정보를 수정합니다"
      />

      <section className="mt-6">
        <AccommodationFormClient
          mode="edit"
          accommodationId={packageid}
        />
      </section>
    </main>
  );
}
