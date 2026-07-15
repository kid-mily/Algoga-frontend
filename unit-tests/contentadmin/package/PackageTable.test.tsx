import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PackageTable from "@/features/contentmanage/package/components/PackageTable";
import type { TravelPackage } from "@/features/contentmanage/package/types";

jest.mock("next/image", () => {
  return function ImageMock({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} />;
  };
});

const packages: TravelPackage[] = [
  {
    packageId: 7,
    countryId: 1,
    countryName: "일본",
    accommodationId: 10,
    accommodationName: "도쿄 호텔",
    name: "도쿄 여행 패키지",
    description: "도쿄 여행 설명",
    imageUrl: "/package.png",
    price: 500000,
    checkInDate: "2026-08-01",
    checkOutDate: "2026-08-03",
    flightInfo: null,
    hasFlightInfo: true,
    flightNumber: "7C123",
    airline: "제주항공",
    departure: "ICN",
    arrival: "NRT",
    departureTime: "2026-08-01T09:00:00",
    arrivalTime: "2026-08-01T11:30:00",
    duration: "2시간 30분",
    flightPrice: 200000,
  },
];

describe("PackageTable 컴포넌트 테스트", () => {
  test("패키지 목록과 수정/삭제 아이콘 버튼을 렌더링한다", () => {
    render(<PackageTable packages={packages} isLoading={false} onDelete={jest.fn()} />);

    expect(screen.getByText("PKG0007")).toBeVisible();
    expect(screen.getByText("도쿄 여행 패키지")).toBeVisible();
    expect(screen.getByText("일본")).toBeVisible();
    expect(screen.getByText("도쿄 호텔")).toBeVisible();
    expect(screen.getByText("ICN → NRT")).toBeVisible();
    expect(screen.getByRole("link", { name: "도쿄 여행 패키지 수정" })).toHaveAttribute(
      "href",
      "/contentadmin/package/7/edit"
    );
    expect(screen.getByRole("button", { name: "도쿄 여행 패키지 삭제" })).toBeVisible();
  });

  test("삭제 아이콘을 클릭하면 삭제 대상 패키지를 전달한다", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(<PackageTable packages={packages} isLoading={false} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: "도쿄 여행 패키지 삭제" }));

    expect(onDelete).toHaveBeenCalledWith(packages[0]);
  });

  test("목록이 비어 있으면 빈 상태 문구를 보여준다", () => {
    render(<PackageTable packages={[]} isLoading={false} onDelete={jest.fn()} />);

    expect(screen.getByText("등록된 패키지가 없습니다.")).toBeVisible();
  });
});
