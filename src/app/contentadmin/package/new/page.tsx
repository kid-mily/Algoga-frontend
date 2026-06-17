import type { Metadata } from "next";
import SubHeader from "@/features/contentmanage/common/SubHeader";
import PackageFormClient from "@/features/contentmanage/package/components/PackageFormClient";

export const metadata: Metadata = {
  title: "패키지 등록 | 알고가 관리자",
  description: "사용자에게 노출할 새 패키지 상품을 등록합니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreatePackagePage() {
  return (
    <main className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/package"
        backText="패키지 관리로 돌아가기"
        title="패키지 등록"
        description="숙소와 항공편 조회 조건을 조합해 패키지 상품을 등록합니다"
      />

      <section className="mt-6">
        <PackageFormClient mode="create" />
      </section>
    </main>
  );
}
