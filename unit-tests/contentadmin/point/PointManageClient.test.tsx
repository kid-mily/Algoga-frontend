import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PointManageClient from "@/features/contentmanage/point/components/PointManageClient";
import { useAdminPointList } from "@/features/contentmanage/point/hooks/useAdminPointList";

jest.mock("@/features/contentmanage/point/hooks/useAdminPointList", () => ({
  useAdminPointList: jest.fn(),
}));

jest.mock("next/image", () => {
  return function ImageMock({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) {
    return <img alt={alt} src={src} />;
  };
});

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const mockedUseAdminPointList = useAdminPointList as jest.Mock;

const students = [
  {
    userId: 1,
    userName: "김민지",
    email: "minji@test.com",
    totalPoint: 12000,
  },
  {
    userId: 2,
    userName: "박서준",
    email: "seo@test.com",
    totalPoint: 5000,
  },
];

describe("PointManageClient 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseAdminPointList.mockReturnValue({
      students,
      isLoading: false,
      error: "",
      giveStudentPoints: jest.fn().mockResolvedValue(true),
      recallStudentPoints: jest.fn().mockResolvedValue(true),
    });
  });

  test("마일리지 관리 화면이 정상적으로 렌더링된다", () => {
    render(<PointManageClient />);

    expect(screen.getByText("마일리지 관리")).toBeVisible();
    expect(screen.getByText("사용자 마일리지를 조회하고 지급합니다")).toBeVisible();
    expect(screen.getByText("김민지")).toBeVisible();
    expect(screen.getByText("박서준")).toBeVisible();
    expect(screen.getByText("minji@test.com")).toBeVisible();
    expect(screen.getByText("12,000원")).toBeVisible();
  });

  test("검색어로 사용자 목록을 필터링한다", async () => {
    const user = userEvent.setup();

    render(<PointManageClient />);

    await user.type(
      screen.getByPlaceholderText("이름, 이메일, 사용자 ID 검색..."),
      "김민지"
    );

    expect(screen.getByText("김민지")).toBeVisible();
    expect(screen.queryByText("박서준")).not.toBeInTheDocument();
  });

  test("상세 내역 확인 버튼을 누르면 상세 페이지로 이동한다", async () => {
    const user = userEvent.setup();

    render(<PointManageClient />);

    await user.click(screen.getAllByRole("button", { name: "상세 내역 확인" })[0]);

    expect(pushMock).toHaveBeenCalledWith("/contentadmin/point/1");
  });

  test("지급 버튼을 누르면 마일리지 지급 모달이 열린다", async () => {
    const user = userEvent.setup();

    render(<PointManageClient />);

    await user.click(screen.getAllByRole("button", { name: "지급" })[0]);

    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByText("마일리지 지급")).toBeVisible();
    expect(screen.getByText("김민지님에게 지급")).toBeVisible();
  });

  test("로딩 상태를 보여준다", () => {
    mockedUseAdminPointList.mockReturnValue({
      students: [],
      isLoading: true,
      error: "",
      giveStudentPoints: jest.fn(),
      recallStudentPoints: jest.fn(),
    });

    render(<PointManageClient />);

    expect(screen.getByText("학생 정보를 불러오는 중입니다...")).toBeVisible();
  });

  test("에러 상태를 보여준다", () => {
    mockedUseAdminPointList.mockReturnValue({
      students: [],
      isLoading: false,
      error: "마일리지 목록 조회 실패",
      giveStudentPoints: jest.fn(),
      recallStudentPoints: jest.fn(),
    });

    render(<PointManageClient />);

    expect(screen.getByText("마일리지 목록 조회 실패")).toBeVisible();
  });
});
