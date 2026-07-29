import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ManagerTable from "@/features/superadmin/manager/components/ManagerTable";
import ManagerToolbar from "@/features/superadmin/manager/components/ManagerToolbar";
import type { AdminManager } from "@/features/superadmin/manager/types";

const managers: AdminManager[] = [
  {
    managerId: 1,
    displayId: "A001",
    loginId: "content01",
    name: "콘텐츠관리자",
    phone: "010-1111-2222",
    email: "content@algoga.kr",
    role: "CONTENT_MANAGER",
    roleLabel: "콘텐츠 매니저",
    createdAt: "2026.07.20",
    active: true,
  },
];

describe("슈퍼어드민 관리자 계정 목록 테스트", () => {
  test("관리자 계정 목록이 정상적으로 렌더링된다", () => {
    render(
      <ManagerTable
        managers={managers}
        isLoading={false}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("A001")).toBeVisible();
    expect(screen.getByText("content01")).toBeVisible();
    expect(screen.getByText("콘텐츠관리자")).toBeVisible();
    expect(screen.getByText("content@algoga.kr")).toBeVisible();
    expect(screen.getByText("콘텐츠 매니저")).toBeVisible();
    expect(screen.getByText("활동중")).toBeVisible();
  });

  test("관리자 계정이 없으면 빈 목록 문구가 보인다", () => {
    render(
      <ManagerTable
        managers={[]}
        isLoading={false}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("조건에 맞는 관리자 계정이 없습니다.")).toBeVisible();
  });

  test("삭제 아이콘 버튼을 누르면 onDelete가 호출된다", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
      <ManagerTable
        managers={managers}
        isLoading={false}
        onDelete={onDelete}
      />
    );

    await user.click(
      screen.getByRole("button", { name: "콘텐츠관리자 관리자 삭제" })
    );

    expect(onDelete).toHaveBeenCalledWith(managers[0]);
  });

  test("권한 필터에는 슈퍼 관리자가 보이지 않는다", () => {
    render(
      <ManagerToolbar
        searchKeyword=""
        selectedRole="ALL"
        onSearchKeywordChange={jest.fn()}
        onSelectedRoleChange={jest.fn()}
      />
    );

    expect(screen.getByRole("option", { name: "전체 권한" })).toBeVisible();
    expect(screen.getByRole("option", { name: "CS 매니저" })).toBeVisible();
    expect(screen.getByRole("option", { name: "콘텐츠 매니저" })).toBeVisible();
    expect(screen.getByRole("option", { name: "정산 매니저" })).toBeVisible();
    expect(screen.getByRole("option", { name: "통계 매니저" })).toBeVisible();
    expect(screen.queryByRole("option", { name: "슈퍼 관리자" })).not.toBeInTheDocument();
  });

  test("검색어와 권한 필터 변경 시 핸들러가 호출된다", async () => {
    const user = userEvent.setup();
    const onSearchKeywordChange = jest.fn();
    const onSelectedRoleChange = jest.fn();

    render(
      <ManagerToolbar
        searchKeyword=""
        selectedRole="ALL"
        onSearchKeywordChange={onSearchKeywordChange}
        onSelectedRoleChange={onSelectedRoleChange}
      />
    );

    await user.type(screen.getByLabelText("이름 또는 로그인 ID 검색"), "cs");
    await user.selectOptions(screen.getByLabelText("권한 필터"), "CS_MANAGER");

    expect(onSearchKeywordChange).toHaveBeenCalled();
    expect(onSelectedRoleChange).toHaveBeenCalledWith("CS_MANAGER");
  });
});
