import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PackageFormClient from "@/features/contentmanage/package/components/PackageFormClient";
import {
  createAdminPackage,
  getAdminPackage,
  getCountryAccommodations,
  updateAdminPackage,
} from "@/features/services/adminPackage.service";
import { getCourseCountries } from "@/features/services/adminCourse.service";

jest.mock("@/features/services/adminPackage.service", () => ({
  createAdminPackage: jest.fn(),
  getAdminPackage: jest.fn(),
  getCountryAccommodations: jest.fn(),
  updateAdminPackage: jest.fn(),
}));

jest.mock("@/features/services/adminCourse.service", () => ({
  getCourseCountries: jest.fn(),
}));

jest.mock("@/features/contentmanage/package/hooks/useFlightSearch", () => ({
  useFlightSearch: () => ({
    flights: [
      {
        flightId: "flight-1",
        airline: "제주항공",
        flightNumber: "7C123",
        departure: "ICN",
        arrival: "NRT",
        origin: "ICN",
        destination: "NRT",
        departureTime: "2026-08-01T09:00:00",
        arrivalTime: "2026-08-01T11:30:00",
        duration: "2시간 30분",
        price: 200000,
      },
    ],
    isSearching: false,
    error: "",
    submitSearch: jest.fn(),
  }),
}));

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const countries = [
  {
    countryId: 1,
    countryName: "일본",
    countryCode: "JP",
    continentCode: "AS",
    continentName: "아시아",
  },
];

const accommodations = [
  {
    accommodationId: 10,
    countryId: 1,
    name: "도쿄 호텔",
    address: "도쿄",
    description: "역 근처 숙소",
    pricePerNight: 100000,
    imageUrl: "/hotel.png",
  },
];

const packageDetail = {
  packageId: 5,
  countryId: 1,
  countryName: "일본",
  accommodationId: 10,
  accommodationName: "도쿄 호텔",
  name: "기존 도쿄 패키지",
  description: "기존 패키지 설명",
  imageUrl: "/package.png",
  price: 500000,
  checkInDate: "2026-08-01",
  checkOutDate: "2026-08-03",
  flightInfo: {
    flightId: "flight-1",
    airline: "제주항공",
    flightNumber: "7C123",
    departure: "ICN",
    arrival: "NRT",
    origin: "ICN",
    destination: "NRT",
    departureTime: "2026-08-01T09:00:00",
    arrivalTime: "2026-08-01T11:30:00",
    duration: "2시간 30분",
    price: 200000,
  },
  hasFlightInfo: true,
  flightNumber: "7C123",
  airline: "제주항공",
  departure: "ICN",
  arrival: "NRT",
  departureTime: "2026-08-01T09:00:00",
  arrivalTime: "2026-08-01T11:30:00",
  duration: "2시간 30분",
  flightPrice: 200000,
};

const createImageFile = () =>
  new File(["package-image"], "package.png", { type: "image/png" });

describe("PackageFormClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getCourseCountries as jest.Mock).mockResolvedValue(countries);
    (getCountryAccommodations as jest.Mock).mockResolvedValue(accommodations);
    (getAdminPackage as jest.Mock).mockResolvedValue(packageDetail);
    (createAdminPackage as jest.Mock).mockResolvedValue({});
    (updateAdminPackage as jest.Mock).mockResolvedValue({});
  });

  test("패키지 등록 폼이 국가와 숙소 목록을 불러와 렌더링된다", async () => {
    render(<PackageFormClient mode="create" />);

    expect(screen.getByText("패키지 정보를 불러오는 중입니다...")).toBeVisible();

    expect(await screen.findByText("패키지명 *")).toBeVisible();
    expect(screen.getByText("항공편 선택 *")).toBeVisible();
    expect(screen.getByRole("button", { name: "등록하기" })).toBeVisible();

    expect(getCourseCountries).toHaveBeenCalledTimes(1);
    expect(getCountryAccommodations).toHaveBeenCalledWith(
      "1",
      expect.any(AbortSignal)
    );
    expect(screen.getByRole("option", { name: "일본" })).toBeInTheDocument();
    expect(await screen.findByRole("option", { name: "도쿄 호텔" })).toBeInTheDocument();
  });

  test("필수 값을 입력하지 않고 등록하면 안내 문구가 보이고 저장 API를 호출하지 않는다", async () => {
    const user = userEvent.setup();

    render(<PackageFormClient mode="create" />);

    await screen.findByText("패키지명 *");
    await screen.findByRole("option", { name: "도쿄 호텔" });
    await user.click(screen.getByRole("button", { name: "등록하기" }));

    expect(screen.getByText("패키지명을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("체크인 날짜를 선택해주세요.")).toBeVisible();
    expect(screen.getByText("체크아웃 날짜를 선택해주세요.")).toBeVisible();
    expect(screen.getByText("패키지 이미지를 선택해주세요.")).toBeVisible();
    expect(screen.getByText("항공편을 검색한 뒤 선택해주세요.")).toBeVisible();
    expect(createAdminPackage).not.toHaveBeenCalled();
  });

  test("이미지와 필수 값을 입력하면 숙소 1박 가격 기준으로 최종 가격을 계산해 등록한다", async () => {
    const user = userEvent.setup();

    render(<PackageFormClient mode="create" />);

    await screen.findByText("패키지명 *");

    await user.type(screen.getByPlaceholderText("일본 도쿄 3박 4일 패키지"), "도쿄 2박 패키지");
    await user.type(screen.getByLabelText("체크인 날짜 *"), "2026-08-01");
    await user.type(screen.getByLabelText("체크아웃 날짜 *"), "2026-08-03");
    await user.upload(
      document.querySelector("#package-image-file") as HTMLInputElement,
      createImageFile()
    );
    await user.type(screen.getByPlaceholderText("패키지 설명을 입력하세요"), "도쿄 여행 패키지입니다.");
    await user.click(screen.getByRole("button", { name: /제주항공 7C123/ }));
    await user.click(screen.getByRole("button", { name: "등록하기" }));

    await waitFor(() => {
      expect(createAdminPackage).toHaveBeenCalledWith(
        expect.objectContaining({
          countryId: 1,
          accommodationId: 10,
          name: "도쿄 2박 패키지",
          description: "도쿄 여행 패키지입니다.",
          price: 400000,
          flightDestination: "NRT",
          airline: "제주항공",
          checkInDate: "2026-08-01",
          checkOutDate: "2026-08-03",
          image: expect.any(File),
        }),
        expect.any(AbortSignal)
      );
    });

    expect(await screen.findByText("등록 완료")).toBeVisible();
  });

  test("수정 모드에서는 기존 패키지 정보를 초기값으로 표시한다", async () => {
    render(<PackageFormClient mode="edit" packageId="5" />);

    expect(await screen.findByDisplayValue("기존 도쿄 패키지")).toBeVisible();
    await screen.findByRole("option", { name: "도쿄 호텔" });
    expect(screen.getByDisplayValue("기존 패키지 설명")).toBeVisible();
    expect(screen.getByLabelText("체크인 날짜 *")).toHaveValue("2026-08-01");
    expect(screen.getByLabelText("체크아웃 날짜 *")).toHaveValue("2026-08-03");
    expect(screen.getByText("새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.")).toBeVisible();
    expect(screen.getByRole("button", { name: "수정하기" })).toBeVisible();
  });

  test("수정 모드 제출 시 수정 API를 호출한다", async () => {
    const user = userEvent.setup();

    render(<PackageFormClient mode="edit" packageId="5" />);

    await screen.findByDisplayValue("기존 도쿄 패키지");
    await screen.findByRole("option", { name: "도쿄 호텔" });
    await user.click(screen.getByRole("button", { name: /제주항공 7C123/ }));
    await user.click(screen.getByRole("button", { name: "수정하기" }));

    await waitFor(() => {
      expect(updateAdminPackage).toHaveBeenCalledWith(
        "5",
        expect.objectContaining({
          countryId: 1,
          accommodationId: 10,
          name: "기존 도쿄 패키지",
          price: 400000,
          flightDestination: "NRT",
          airline: "제주항공",
          image: null,
        }),
        expect.any(AbortSignal)
      );
    });

    expect(createAdminPackage).not.toHaveBeenCalled();
  });
});
