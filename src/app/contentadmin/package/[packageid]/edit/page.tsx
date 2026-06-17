import type { Metadata } from "next";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import PackageFormClient from "@/features/contentmanage/package/components/PackageFormClient";

interface EditPackagePageProps {
  params: Promise<{
    packageid: string;
  }>;
}

export const metadata: Metadata = {
  title: "패키지 수정 | 알고가 관리자",
  description: "등록된 패키지 상품의 기본 정보와 항공편 조회 조건을 수정합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const { packageid } = await params;

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/package"
        backText="패키지 관리로 돌아가기"
        title="패키지 수정"
        description="사용자에게 노출할 패키지 상품 정보를 수정합니다"
      />

      <section className="mt-6">
        <PackageFormClient mode="edit" packageId={packageid} />
      </section>
    </main>
  );
}
