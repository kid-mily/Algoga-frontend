import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CouponForm from "@/features/contentmanage/coupon/components/CouponForm";

const pushMock = jest.fn();
const backMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    back: backMock,
    refresh: refreshMock,
  }),
}));

const courses = [
  {
    courseId: 12,
    countryId: 1,
    title: "오사카 여행 준비",
    description: "오사카 강의",
    price: 120000,
    level: "INTERMEDIATE",
    status: "PUBLISHED",
    maxRewardMileage: 1000,
  },
];

describe("CouponForm 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("쿠폰 등록 폼이 정상적으로 렌더링된다", () => {
    render(<CouponForm courses={courses} onSubmit={jest.fn()} />);

    expect(screen.getByText("쿠폰 등록")).toBeVisible();
    expect(screen.getByLabelText("연결할 강의 선택 *")).toBeVisible();
    expect(screen.getByLabelText("쿠폰 이름 *")).toBeVisible();
    expect(screen.getByLabelText("할인율(%) *")).toBeVisible();
    expect(screen.getByLabelText("상태 *")).toBeVisible();
    expect(screen.getByRole("button", { name: "등록하기" })).toBeVisible();
  });

  test("필수 값을 입력하지 않고 등록하면 안내 문구가 보인다", async () => {
    const onSubmit = jest.fn();

    render(<CouponForm courses={courses} onSubmit={onSubmit} />);

    fireEvent.submit(screen.getByRole("form", { name: "쿠폰 등록" }));

    expect(screen.getByText("연결할 강의를 선택해주세요.")).toBeVisible();
    expect(screen.getByText("쿠폰 이름을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("할인율은 1~100 사이로 입력해주세요.")).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("할인율이 1~100 범위를 벗어나면 등록되지 않는다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<CouponForm courses={courses} onSubmit={onSubmit} />);

    await user.selectOptions(screen.getByLabelText("연결할 강의 선택 *"), "12");
    await user.type(screen.getByLabelText("쿠폰 이름 *"), "수료 할인 쿠폰");
    await user.type(screen.getByLabelText("할인율(%) *"), "101");

    fireEvent.submit(screen.getByRole("form", { name: "쿠폰 등록" }));

    expect(screen.getByText("할인율은 1~100 사이로 입력해주세요.")).toBeVisible();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("입력값이 올바르면 쿠폰 등록 요청을 보낸다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(true);

    render(<CouponForm courses={courses} onSubmit={onSubmit} />);

    await user.selectOptions(screen.getByLabelText("연결할 강의 선택 *"), "12");
    await user.type(screen.getByLabelText("쿠폰 이름 *"), "수료 할인 쿠폰");
    await user.type(screen.getByLabelText("할인율(%) *"), "10");
    await user.selectOptions(screen.getByLabelText("상태 *"), "true");

    await user.click(screen.getByRole("button", { name: "등록하기" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        courseId: 12,
        couponName: "수료 할인 쿠폰",
        percent: 10,
        validDays: 30,
        active: true,
      });
    });

    expect(await screen.findByText("등록 완료")).toBeVisible();
  });

  test("수정 모드에서는 기존 쿠폰 정보가 초기값으로 표시된다", () => {
    render(
      <CouponForm
        courses={courses}
        isEdit
        initialData={{
          courseId: "12",
          couponName: "기존 쿠폰",
          percent: "15",
          active: "false",
        }}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText("쿠폰 수정")).toBeVisible();
    expect(screen.getByLabelText("연결할 강의 선택 *")).toBeDisabled();
    expect(screen.getByLabelText("쿠폰 이름 *")).toHaveValue("기존 쿠폰");
    expect(screen.getByLabelText("할인율(%) *")).toHaveValue(15);
    expect(screen.getByLabelText("상태 *")).toHaveValue("false");
    expect(screen.getByRole("button", { name: "수정하기" })).toBeVisible();
  });
});
