import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PointAdjustModal from "@/features/contentmanage/point/components/PointAdjustModal";

describe("PointAdjustModal 컴포넌트 테스트", () => {
  test("open이 false면 모달이 보이지 않는다", () => {
    render(
      <PointAdjustModal
        open={false}
        mode="give"
        studentName="김민지"
        currentPoint={10000}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("마일리지 지급 값을 입력하고 제출한다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(true);

    render(
      <PointAdjustModal
        open
        mode="give"
        studentName="김민지"
        currentPoint={10000}
        onClose={jest.fn()}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText("마일리지 지급")).toBeVisible();
    expect(screen.getAllByText("10,000원")[0]).toBeVisible();

    await user.type(screen.getByLabelText("지급 금액 (원)"), "3000");
    await user.type(screen.getByLabelText("지급 사유"), "이벤트 보상");
    await user.click(screen.getByRole("button", { name: "지급하기" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(3000, "이벤트 보상");
    });
  });

  test("회수 금액이 보유 마일리지보다 크면 제출할 수 없다", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <PointAdjustModal
        open
        mode="recall"
        studentName="김민지"
        currentPoint={10000}
        onClose={jest.fn()}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText("회수 금액 (원)"), "20000");
    await user.type(screen.getByLabelText("회수 사유"), "오지급 회수");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "보유 마일리지보다 많이 회수할 수 없습니다."
    );
    expect(screen.getByRole("button", { name: "회수하기" })).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("닫기 버튼을 누르면 onClose가 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <PointAdjustModal
        open
        mode="give"
        studentName="김민지"
        currentPoint={10000}
        onClose={onClose}
        onSubmit={jest.fn()}
      />
    );

    await user.click(screen.getByLabelText("마일리지 모달 닫기"));

    expect(onClose).toHaveBeenCalled();
  });
});
