"use client";

import { useParams } from "next/navigation";
import PackageForm from "@/features/contentmanage/package/PackageForm";
import SubHeader from "@/features/contentmanage/common/SubHeader";

import {
  packages,
} from "@/features/contentmanage/MockData";

export default function EditPackagePage() {

  const params = useParams();

  const packageid = Number(params.packageid);
  // 현재 패키지 찾기
  const packageItem =
    packages.find(
      (item) =>
        item.id === packageid
    );

  // 없으면 종료
  if (!packageItem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-8 py-8">
      <SubHeader
        backHref="/contentadmin/package"
        backText="패키지 목록으로 돌아가기"
        title="패키지 수정"
        description="패키지 정보를 수정합니다"
      />
      <div className="mt-6">
        <PackageForm
          mode="edit"
          initialData={{
            title:
              packageItem.title,
            destination:
              packageItem.location,
            nights:
              Number(
                packageItem.duration.split("박")[0]
              ),
            discountPercent:
              packageItem.discountPercent,
            description:
              packageItem.description,
            lecture:
              packageItem.lecture,
            airline:
              packageItem.flight.airline,
            airlinePrice:
              packageItem.flight.price,
            hotel:
              packageItem.hotel.hotel,
            hotelPrice:
              packageItem.hotel.price,
          }}
        />
      </div>
    </div>
  );
}