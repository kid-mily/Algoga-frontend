import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CouponTable from "@/features/contentmanage/coupon/components/CouponTable";
import type { CouponWithLecture } from "@/features/contentmanage/coupon/types";

const coupons: CouponWithLecture[] = [
  {
    couponPolicyId: 1,
    courseId: 12,
    managerId: 1,
    couponName: "수료 할인 쿠폰",
    percent: 10,
    validDays: 30,
    active: true,
    createdAt: "2026-07-14T00:00:00",
    updatedAt: "2026-07-14T00:00:00",
    lectureName: "오사카 여행 준비",
  },
];

describe("CouponTable 컴포넌트 테스트", () => {
  test("쿠폰 목록이 정상적으로 렌더링된다", () => {
    render(
      <CouponTable
        coupons={coupons}
        totalCount={1}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("수료 할인 쿠폰")).toBeVisible();
    expect(screen.getByText("오사카 여행 준비")).toBeVisible();
    expect(screen.getByText("10%")).toBeVisible();
    expect(screen.getByText((content) => content.includes("30일"))).toBeVisible();
    expect(screen.getByText("사용가능")).toBeVisible();
    expect(screen.getByText("총 1개의 쿠폰")).toBeVisible();
  });

  test("쿠폰이 없으면 빈 목록 문구가 보인다", () => {
    render(
      <CouponTable
        coupons={[]}
        totalCount={0}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("등록된 쿠폰이 없습니다.")).toBeVisible();
    expect(screen.getByText("총 0개의 쿠폰")).toBeVisible();
  });

  test("수정 버튼을 누르면 onEdit이 호출된다", async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();

    render(
      <CouponTable
        coupons={coupons}
        totalCount={1}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "수료 할인 쿠폰 수정" }));

    expect(onEdit).toHaveBeenCalledWith(coupons[0]);
  });

  test("삭제 버튼을 누르면 onDelete가 호출된다", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
      <CouponTable
        coupons={coupons}
        totalCount={1}
        onEdit={jest.fn()}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByRole("button", { name: "수료 할인 쿠폰 삭제" }));

    expect(onDelete).toHaveBeenCalledWith(coupons[0]);
  });
});
