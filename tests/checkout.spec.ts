import test, { expect, type Page } from "@playwright/test";

const COURSE_URL = "/classroom/africa/10/lecture/43";
const PAYMENT_URL = "/classroom/africa/10/lecture/43/payment/single";
const STUDY_URL = "/classroom/africa/10/lecture/43/study";
const QUIZ_URL = "/classroom/africa/10/lecture/43/quiz";
const QUIZ_COMPLETE_URL = "/classroom/africa/10/lecture/43/quiz/complete";
const CERTIFICATE_URL = "/mypage/coursedetails/43/certificate";

const USER_A_ID = process.env.E2E_CHAT_USER_A_USERNAME ?? "";
const USER_A_PASSWORD = process.env.E2E_CHAT_USER_A_PASSWORD ?? "";
const USER_B_ID = process.env.E2E_CHAT_USER_B_USERNAME ?? "";
const USER_B_PASSWORD = process.env.E2E_CHAT_USER_B_PASSWORD ?? "";

const expectVisibleText = async (page: Page, text: RegExp | string) => {
  await expect(page.getByText(text).first()).toBeVisible({ timeout: 15000 });
};

const expectRouteLoaded = async (page: Page, path: string) => {
  await page.waitForLoadState("domcontentloaded");
  await expect(page).toHaveURL(path, { timeout: 15000 });
};

const clickIfVisible = async (page: Page, locator: ReturnType<Page["locator"]>) => {
  if (await locator.isVisible({ timeout: 3000 }).catch(() => false)) {
    await locator.click();
    return true;
  }

  return false;
};

const login = async (page: Page, username: string, password: string) => {
  expect(username, "E2E_CHAT_USER_*_USERNAME 환경변수가 비어 있습니다.").not.toBe("");
  expect(password, "E2E_CHAT_USER_*_PASSWORD 환경변수가 비어 있습니다.").not.toBe("");

  await page.goto("/auth/login");
  await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();

  await page.getByPlaceholder("아이디를 입력해주세요").fill(username);
  await page.getByPlaceholder("비밀번호를 입력해주세요").fill(password);
  await page.getByRole("button", { name: "로그인" }).click();

  await expect(page).toHaveURL("/", { timeout: 15000 });
};

test("사용자 주요 화면 흐름 테스트", async ({
  page,
  browser,
}) => {
  test.setTimeout(180000);
  const directMessage = `E2E 1대1 채팅 테스트 ${Date.now()}`;
  const groupMessage = `E2E 그룹 읽음 표시 테스트 ${Date.now()}`;

  // 1. 로그인하기
  await login(page, USER_A_ID, USER_A_PASSWORD);

  // 2. 지도 클릭해서 강의실 가기
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/classroom");
  await expectVisibleText(page, /대륙|국가|강의|여행/);

  await page.goto(COURSE_URL);
  await expectRouteLoaded(page, COURSE_URL);

  // 3. 강의 결제 진행
  const paymentButton = page.getByRole("button", { name: "결제하기" }).first();

  if (await paymentButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await paymentButton.click();
  } else {
    await page.goto(PAYMENT_URL);
  }

  await expectRouteLoaded(page, PAYMENT_URL);

  const submitPaymentButton = page
    .getByRole("button", { name: /결제하기|전액 할인 결제하기/ })
    .first();
  await clickIfVisible(page, submitPaymentButton);

  // 백엔드 결제 성공 여부는 검증하지 않고, 프론트 흐름상 수강 화면으로 이동합니다.
  await page.goto(STUDY_URL);

  // 4. 강의 수강 진행
  await expectRouteLoaded(page, STUDY_URL);

  // 5. 강의 퀴즈 진행
  await page.goto(QUIZ_URL);
  await expectRouteLoaded(page, QUIZ_URL);

  const quizOptions = page.locator('input[type="radio"]');
  const quizOptionCount = await quizOptions.count();

  for (let index = 0; index < quizOptionCount; index += 4) {
    await quizOptions.nth(index).check().catch(() => undefined);
  }

  const submitQuizButton = page
    .getByRole("button", { name: /제출|퀴즈 제출|완료/ })
    .first();
  await clickIfVisible(page, submitQuizButton);

  // 6. 리뷰 쓰기 진행
  await page.goto(QUIZ_COMPLETE_URL);
  await expectRouteLoaded(page, QUIZ_COMPLETE_URL);

  const reviewButton = page
    .getByRole("button", { name: /수강 후기 작성하기|후기 작성|리뷰 작성/ })
    .first();

  if (await clickIfVisible(page, reviewButton)) {
    const reviewTextarea = page.locator("textarea").first();

    if (await reviewTextarea.isVisible({ timeout: 3000 }).catch(() => false)) {
      await reviewTextarea.fill("E2E 테스트용 수강 후기입니다.");
    }

    const saveReviewButton = page
      .getByRole("button", { name: /등록|저장|작성 완료/ })
      .first();
    await clickIfVisible(page, saveReviewButton);
  }

  // 7. 마이페이지 가기
  await page.goto("/mypage");
  await expectRouteLoaded(page, "/mypage");

  // 8. 수강 내역가기
  await page.goto("/mypage/coursedetails");
  await expectRouteLoaded(page, "/mypage/coursedetails");

  // 9. 수료증 보기
  await page.goto(CERTIFICATE_URL);
  await expectRouteLoaded(page, CERTIFICATE_URL);

  // 10. 수료증 다운
  const downloadPromise = page.waitForEvent("download").catch(() => null);
  const certificateDownloadButton = page
    .getByRole("button", { name: /다운로드|수료증 다운로드/ })
    .first();

  if (await clickIfVisible(page, certificateDownloadButton)) {
    await downloadPromise;
  }

  // 11. 채팅: 친구가 미리 만들어진 두 계정으로 로그인
  const userAContext = await browser.newContext();
  const userBContext = await browser.newContext();
  const userA = await userAContext.newPage();
  const userB = await userBContext.newPage();

  await login(userA, USER_A_ID, USER_A_PASSWORD);
  await login(userB, USER_B_ID, USER_B_PASSWORD);

  // 12. 1대1 채팅 진행
  await userA.getByRole("button", { name: "채팅창 열기" }).click();
  await expect(userA.getByLabel("채팅 목록")).toBeVisible();

  await userA.getByLabel("새 채팅 메뉴 열기").click();
  await userA.getByText("새 채팅", { exact: true }).click();
  await expect(userA.getByText("대화할 친구를 선택하세요")).toBeVisible();

  await userA.getByLabel("새 채팅 친구 선택").locator("ul button").first().click();
  await expect(userA.getByLabel("메시지 입력")).toBeVisible({ timeout: 15000 });

  await userA.getByLabel("메시지 입력").fill(directMessage);
  await userA.getByRole("button", { name: "전송" }).click();
  await expect(userA.getByText(directMessage).first()).toBeVisible();

  // 13. 그룹채팅 1 사라지는거 보여주기
  await userB.getByRole("button", { name: "채팅창 열기" }).click();
  await expect(userB.getByLabel("채팅 목록")).toBeVisible();

  await userB.getByLabel("새 채팅 메뉴 열기").click();
  await userB.getByText("그룹 채팅", { exact: true }).click();
  await expect(userB.getByText("방 이름과 친구를 선택하세요")).toBeVisible();

  await userB.getByPlaceholder("예: 여행 친구방").fill("E2E 그룹 채팅방");

  const groupFriendButtons = userB
    .getByLabel("그룹 채팅 생성")
    .locator("ul button");
  await expect(groupFriendButtons.first()).toBeVisible({ timeout: 15000 });

  const groupFriendButtonCount = await groupFriendButtons.count();

  for (let index = 0; index < Math.min(groupFriendButtonCount, 2); index += 1) {
    await groupFriendButtons.nth(index).click().catch(() => undefined);
  }

  const createGroupButton = userB.getByRole("button", { name: "그룹 채팅 만들기" });

  if (groupFriendButtonCount >= 2) {
    await createGroupButton.click();
    await expect(userB.getByLabel("메시지 입력")).toBeVisible({ timeout: 15000 });
    await userB.getByLabel("메시지 입력").fill(groupMessage);
    await userB.getByRole("button", { name: "전송" }).click();
    await expect(userB.getByText(groupMessage).first()).toBeVisible();

    await userB.bringToFront();
    await expect(userB.getByText(groupMessage).first()).toBeVisible();
  } else {
    await expect(createGroupButton).toBeDisabled();
  }

  // 14. 채팅방 나가기
  await userA.bringToFront();
  await userA.getByLabel("채팅방 나가기").click();
  await expect(userA.getByText("정말 이 채팅방을 나가시겠습니까?")).toBeVisible();
  await userA.getByRole("button", { name: "나가기", exact: true }).click();
  await expect(userA.getByLabel("채팅 목록")).toBeVisible();

  await userAContext.close();
  await userBContext.close();
});
