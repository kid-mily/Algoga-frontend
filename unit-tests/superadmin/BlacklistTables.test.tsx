import { render, screen } from "@testing-library/react";
import {
  BlacklistedTable,
  CandidateTable,
} from "@/features/superadmin/blacklist/components/BlacklistTables";
import type { BlacklistUser } from "@/features/superadmin/blacklist/types";

const users: BlacklistUser[] = [
  {
    userId: 105,
    displayId: "U0105",
    username: "baduser123",
    name: "홍길동",
    nickname: "악플러",
    email: "baduser@example.com",
    reportCount: 7,
    lastReportedAt: "2026.07.10",
    isBlacklisted: true,
    registeredAt: "2026.07.11",
    managerName: "슈퍼관리자",
    status: "BLACKLISTED",
  },
];

describe("슈퍼어드민 블랙리스트 테이블 테스트", () => {
  test("후보 목록은 유저 정보와 상세보기 링크를 렌더링한다", () => {
    render(<CandidateTable users={users} isLoading={false} />);

    expect(screen.getByText("U0105")).toBeVisible();
    expect(screen.getByText("홍길동")).toBeVisible();
    expect(screen.getByText("악플러")).toBeVisible();
    expect(screen.getByText("baduser@example.com")).toBeVisible();
    expect(screen.getByText("7회")).toBeVisible();
    expect(screen.getByRole("link", { name: "홍길동 상세 보기" })).toHaveAttribute(
      "href",
      "/superadmin/blacklist/105"
    );
  });

  test("후보가 없으면 빈 목록 문구가 보인다", () => {
    render(<CandidateTable users={[]} isLoading={false} />);

    expect(screen.getByText("블랙리스트 후보가 없습니다.")).toBeVisible();
  });

  test("블랙리스트 목록은 백엔드 응답 필드 기준 정보를 렌더링한다", () => {
    render(<BlacklistedTable users={users} isLoading={false} />);

    expect(screen.getByText("105")).toBeVisible();
    expect(screen.getByText("baduser123")).toBeVisible();
    expect(screen.getByText("홍길동")).toBeVisible();
    expect(screen.getByText("악플러")).toBeVisible();
    expect(screen.getByText("baduser@example.com")).toBeVisible();
    expect(screen.getByText("등록됨")).toBeVisible();
    expect(screen.getByRole("link", { name: "홍길동 상세 보기" })).toHaveAttribute(
      "href",
      "/superadmin/blacklist/105"
    );
  });

  test("등록된 블랙리스트가 없으면 빈 목록 문구가 보인다", () => {
    render(<BlacklistedTable users={[]} isLoading={false} />);

    expect(screen.getByText("등록된 블랙리스트가 없습니다.")).toBeVisible();
  });
});
