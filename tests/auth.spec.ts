import { test, expect } from "@playwright/test";

test.describe("사용자 로그인 플로우", () => {
  test("로그인 성공 시나리오", async ({ page }) => {
    const username = process.env.E2E_LOGIN_USERNAME;
    const password = process.env.E2E_LOGIN_PASSWORD;

    test.skip(
      !username || !password,
      "실제 로그인 성공 테스트는 E2E_LOGIN_USERNAME/E2E_LOGIN_PASSWORD 환경변수가 필요합니다."
    );

    // Given: 로그인 페이지 접속
    await page.goto("/auth/login");

    // When: 실제 존재하는 계정 입력
    await page.getByPlaceholder("아이디를 입력해주세요").fill('lsc7439');
    await page.getByPlaceholder("비밀번호를 입력해주세요").fill('password123');

    await page.getByRole("button", { name: "로그인" }).click();

    // Then: 메인 페이지로 이동 확인
    await expect(page).toHaveURL("/");
  });

  test("로그인 실패 시나리오", async ({ page }) => {
    // Given: 로그인 페이지 접속
    await page.goto("/auth/login");

    // When: 틀린 로그인 정보 입력
    await page.getByPlaceholder("아이디를 입력해주세요").fill("wronguser");
    await page.getByPlaceholder("비밀번호를 입력해주세요").fill("wrongpassword");

    await page.getByRole("button", { name: "로그인" }).click();

    // Then: 입력창 아래 에러 문구 확인
    await expect(
      page.getByText("아이디 또는 비밀번호가 틀렸습니다.").first()
    ).toBeVisible();

    // 여전히 로그인 페이지인지 확인
    await expect(page).toHaveURL("/auth/login");
  });

  test("아이디를 입력하지 않으면 안내 문구가 보인다", async ({ page }) => {
    // Given
    await page.goto("/auth/login");

    // When
    await page.getByPlaceholder("비밀번호를 입력해주세요").fill("password123");
    await page.getByRole("button", { name: "로그인" }).click();

    // Then
    await expect(page.getByText("아이디를 입력해주세요.")).toBeVisible();
  });

  test("비밀번호를 입력하지 않으면 안내 문구가 보인다", async ({ page }) => {
    // Given
    await page.goto("/auth/login");

    // When
    await page.getByPlaceholder("아이디를 입력해주세요").fill("testuser");
    await page.getByRole("button", { name: "로그인" }).click();

    // Then
    await expect(page.getByText("비밀번호를 입력해주세요.")).toBeVisible();
  });

  test("아이디 찾기 페이지가 정상적으로 보인다", async ({ page }) => {
    await page.goto("/auth/login/findid");

    await expect(
      page.getByRole("heading", { name: "아이디 찾기" })
    ).toBeVisible();
    await expect(page.getByPlaceholder("이름을 입력해주세요")).toBeVisible();
    await expect(page.getByPlaceholder("이메일을 입력해주세요")).toBeVisible();
  });

  test("이름과 이메일을 입력하지 않으면 에러 메시지가 보인다", async ({ page }) => {
    // Given
    await page.goto("/auth/login/findid");

    // When
    await page.getByRole("button", { name: "아이디 찾기" }).click();

    // Then
    await expect(page.getByText("이름과 이메일을 모두 입력해주세요.")).toBeVisible();
  });

  test("아이디 찾기 링크로 이동할 수 있다", async ({ page }) => {
    await page.goto("/auth/login");

    await page.getByRole("link", { name: "아이디 찾기" }).click();

    await expect(page).toHaveURL("/auth/login/findid");
    await expect(
      page.getByRole("heading", { name: "아이디 찾기" })
    ).toBeVisible();
  });
});

  test.describe("비밀번호 찾기 플로우", () => {
    test("비밀번호 찾기 페이지가 정상적으로 보인다", async ({ page }) => {
      // Given
      await page.goto("/auth/login/findpw");

      // Then
      await expect(page.getByText("비밀번호 찾기")).toBeVisible();
      await expect(page.getByPlaceholder("아이디를 입력해주세요")).toBeVisible();
      await expect(page.getByPlaceholder("이메일을 입력해주세요")).toBeVisible();
    });

    test("아이디와 이메일을 입력하지 않으면 에러 메시지가 보인다", async ({ page }) => {
      // Given
      await page.goto("/auth/login/findpw");

      // When
      await page.getByRole("button", { name: "임시 비밀번호 전송" }).click();

      // Then
      await expect(page.getByText("아이디와 이메일을 모두 입력해주세요.")).toBeVisible();
    });

    test("비밀번호 찾기 링크로 이동할 수 있다", async ({ page }) => {
      // Given
      await page.goto("/auth/login");

      // When
      await page.getByRole("link", { name: "비밀번호 찾기" }).click();

      // Then
      await expect(page).toHaveURL("/auth/login/findpw");
      await expect(page.getByText("비밀번호 찾기")).toBeVisible();
    });

    test("비밀번호 찾기에서 아이디 찾기 페이지로 이동할 수 있다", async ({ page }) => {
      await page.goto("/auth/login/findpw");

      await page.getByRole("link", { name: "아이디가 기억나지 않으시나요?" }).click();

      await expect(page).toHaveURL("/auth/login/findid");
      await expect(
        page.getByRole("heading", { name: "아이디 찾기" })
      ).toBeVisible();
  });
});
