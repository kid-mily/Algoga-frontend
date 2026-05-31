import PackageForm from "@/features/contentmanage/package/PackageForm";
import SubHeader from "@/features/contentmanage/common/SubHeader";
export default function CreatePackagePage() {

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/package"
        backText="패키지 목록으로 돌아가기"
        title="패키지 등록"
        description="새로운 여행 패키지를 등록합니다"
      />

      <div className="mt-6">
        <PackageForm mode="create" />
      </div>
    </div>
  );
}