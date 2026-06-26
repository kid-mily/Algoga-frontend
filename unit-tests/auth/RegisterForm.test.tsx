import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import RegisterInfoForm from "@/features/auth/components/RegisterInfoForm";
import type { RegisterFormData } from "@/features/auth/types";
import {
  checkUsernameDuplicate,
  sendSignupEmailCode,
  verifySignupEmailCode,
} from "@/features/services/signup.service";

jest.mock("@/features/services/signup.service", () => ({
  checkUsernameDuplicate: jest.fn(),
  sendSignupEmailCode: jest.fn(),
  verifySignupEmailCode: jest.fn(),
}));

const createFormData = (
  overrides: Partial<RegisterFormData> = {}
): RegisterFormData => ({
  name: "",
  username: "",
  password: "",
  passwordConfirm: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  nickname: "",
  socialType: "",
  referralCode: "",
  signupPath: "",
  termsServiceAgreed: false,
  termsPrivacyAgreed: false,
  termsMarketingAgreed: false,
  ...overrides,
});

function RegisterInfoFormHarness({
  initialFormData,
  onNext,
}: {
  initialFormData: RegisterFormData;
  onNext: () => void;
}) {
  const [formData, setFormData] = useState(initialFormData);

  return (
    <RegisterInfoForm
      formData={formData}
      onChange={(field, value) =>
        setFormData((prev) => ({ ...prev, [field]: value }))
      }
      onNext={onNext}
    />
  );
}

describe("RegisterInfoForm 컴포넌트 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("회원가입 정보 입력 폼이 정상적으로 렌더링된다", () => {
    render(
      <RegisterInfoForm
        formData={createFormData()}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText("홍길동")).toBeVisible();
    expect(screen.getByPlaceholderText("4자 이상 20자 이하")).toBeVisible();
    expect(screen.getByPlaceholderText("8자 이상 영문, 숫자 조합")).toBeVisible();
    expect(screen.getByPlaceholderText("example@algoga.com")).toBeVisible();
    expect(screen.getByRole("button", { name: "다음 단계로 이동" })).toBeVisible();
  });

  test("필수 정보를 입력하지 않고 다음 버튼을 누르면 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(
      <RegisterInfoForm
        formData={createFormData()}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "다음 단계로 이동" }));

    expect(screen.getByText("이름은 필수입니다.")).toBeVisible();
    expect(screen.getByText("아이디는 4자 이상 20자 이하로 입력해주세요.")).toBeVisible();
    expect(screen.getByText("비밀번호는 영문, 숫자 조합 8자 이상이어야 합니다.")).toBeVisible();
    expect(screen.getByText("올바른 이메일 형식을 입력해주세요.")).toBeVisible();
    expect(screen.getByText("올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)")).toBeVisible();
    expect(screen.getByText("생년월일은 필수입니다.")).toBeVisible();
    expect(screen.getByText("성별은 필수입니다.")).toBeVisible();
    expect(screen.getByText("닉네임은 필수이며 50자 이내여야 합니다.")).toBeVisible();
  });

  test("이름을 입력하면 name 필드 변경 함수가 호출된다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <RegisterInfoForm
        formData={createFormData()}
        onChange={onChange}
        onNext={jest.fn()}
      />
    );

    await user.type(screen.getByPlaceholderText("홍길동"), "김알고");

    expect(onChange).toHaveBeenCalledWith("name", "김");
    expect(onChange).toHaveBeenCalledWith("name", "고");
  });

  test("전화번호를 숫자로 입력하면 하이픈 형식으로 변경된다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <RegisterInfoForm
        formData={createFormData()}
        onChange={onChange}
        onNext={jest.fn()}
      />
    );

    await user.type(screen.getByPlaceholderText("010-0000-0000"), "01012345678");

    expect(onChange).toHaveBeenCalledWith("phone", "0");
    expect(onChange).toHaveBeenCalledWith("phone", "8");
  });

  test("비밀번호와 비밀번호 확인이 다르면 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(
      <RegisterInfoForm
        formData={createFormData({
          name: "김알고",
          username: "testuser",
          password: "password123",
          passwordConfirm: "password456",
          email: "test@example.com",
          phone: "010-1234-5678",
          birthDate: "2000-01-01",
          gender: "MALE",
          nickname: "알고가조아",
        })}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "다음 단계로 이동" }));

    expect(screen.getByText("비밀번호가 일치하지 않습니다.")).toBeVisible();
  });

  test("아이디 중복 확인에 성공하면 사용 가능 메시지가 보인다", async () => {
    const user = userEvent.setup();

    (checkUsernameDuplicate as jest.Mock).mockResolvedValueOnce(true);

    render(
      <RegisterInfoForm
        formData={createFormData({ username: "testuser" })}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "중복 확인: 사용자 이름 검사" }));

    expect(await screen.findByText("사용 가능한 아이디입니다.")).toBeVisible();
    expect(checkUsernameDuplicate).toHaveBeenCalledWith(
      "testuser",
      expect.any(AbortSignal)
    );
  });

  test("아이디 중복 확인을 하지 않으면 다음 단계로 이동하지 않고 안내 문구가 보인다", async () => {
    const user = userEvent.setup();
    const onNext = jest.fn();

    render(
      <RegisterInfoForm
        formData={createFormData({
          name: "김알고",
          username: "testuser",
          password: "password123",
          passwordConfirm: "password123",
          email: "test@example.com",
          phone: "010-1234-5678",
          birthDate: "2000-01-01",
          gender: "MALE",
          nickname: "알고가조아",
        })}
        onChange={jest.fn()}
        onNext={onNext}
      />
    );

    await user.click(screen.getByRole("button", { name: "다음 단계로 이동" }));

    expect(screen.getByText("아이디 중복 확인을 완료해주세요.")).toBeVisible();
    expect(onNext).not.toHaveBeenCalled();
  });

  test("아이디가 4자 미만이면 중복 확인 요청을 보내지 않고 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    render(
      <RegisterInfoForm
        formData={createFormData({ username: "abc" })}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "중복 확인: 사용자 이름 검사" }));

    expect(screen.getByText("아이디는 4자 이상 20자 이하로 입력해주세요.")).toBeVisible();
    expect(checkUsernameDuplicate).not.toHaveBeenCalled();
  });

  test("아이디 입력 시 아이디 서버 에러를 초기화한다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const setServerError = jest.fn();

    render(
      <RegisterInfoForm
        formData={createFormData()}
        onChange={onChange}
        onNext={jest.fn()}
        serverError={{ field: "username", message: "이미 등록된 아이디입니다." }}
        setServerError={setServerError}
      />
    );

    await user.type(screen.getByPlaceholderText("4자 이상 20자 이하"), "a");

    expect(onChange).toHaveBeenCalledWith("username", "a");
    expect(setServerError).toHaveBeenCalledWith({ field: "", message: "" });
  });

  test("이미 사용 중인 아이디면 에러 문구가 보인다", async () => {
    const user = userEvent.setup();

    (checkUsernameDuplicate as jest.Mock).mockResolvedValueOnce(false);

    render(
      <RegisterInfoForm
        formData={createFormData({ username: "testuser" })}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "중복 확인: 사용자 이름 검사" }));

    expect(await screen.findByText("이미 사용 중인 아이디입니다.")).toBeVisible();
  });

  test("아이디 중복 확인 요청이 실패하면 실패 메시지가 보인다", async () => {
    const user = userEvent.setup();

    (checkUsernameDuplicate as jest.Mock).mockRejectedValueOnce(
      new Error("아이디 중복 확인에 실패했습니다.")
    );

    render(
      <RegisterInfoForm
        formData={createFormData({ username: "testuser" })}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "중복 확인: 사용자 이름 검사" }));

    expect(await screen.findByText("아이디 중복 확인에 실패했습니다.")).toBeVisible();
  });

  test("이메일 인증번호 발송에 성공하면 인증번호 입력창이 보인다", async () => {
    const user = userEvent.setup();

    (sendSignupEmailCode as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <RegisterInfoForm
        formData={createFormData({ email: "test@example.com" })}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "인증: 이메일 인증번호 발송" }));

    expect(await screen.findByText("인증번호를 이메일로 보냈습니다.")).toBeVisible();
    expect(screen.getByPlaceholderText("인증번호 입력")).toBeVisible();
  });

  test("올바르지 않은 이메일이면 인증번호 발송 요청을 보내지 않고 안내 문구가 보인다", async () => {
    render(
      <RegisterInfoForm
        formData={createFormData({ email: "wrong-email" })}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "인증: 이메일 인증번호 발송" })).toBeDisabled();

    expect(sendSignupEmailCode).not.toHaveBeenCalled();
  });

  test("이미 가입된 이메일이면 이메일 중복 안내 문구가 보인다", async () => {
    const user = userEvent.setup();

    (sendSignupEmailCode as jest.Mock).mockRejectedValueOnce(
      new Error("이미 가입된 이메일입니다.")
    );

    render(
      <RegisterInfoForm
        formData={createFormData({ email: "test@example.com" })}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "인증: 이메일 인증번호 발송" }));

    expect(await screen.findByText("이미 가입된 이메일입니다.")).toBeVisible();
  });

  test("이메일 인증번호 발송이 실패하면 실패 메시지가 보인다", async () => {
    const user = userEvent.setup();

    (sendSignupEmailCode as jest.Mock).mockRejectedValueOnce(
      new Error("이메일 인증번호 발송에 실패했습니다.")
    );

    render(
      <RegisterInfoForm
        formData={createFormData({ email: "test@example.com" })}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "인증: 이메일 인증번호 발송" }));

    expect(await screen.findByText("이메일 인증번호 발송에 실패했습니다.")).toBeVisible();
  });

  test("이메일 입력 시 이메일 서버 에러와 인증 상태를 초기화한다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const setServerError = jest.fn();

    render(
      <RegisterInfoForm
        formData={createFormData()}
        onChange={onChange}
        onNext={jest.fn()}
        serverError={{ field: "email", message: "이미 가입된 이메일입니다." }}
        setServerError={setServerError}
      />
    );

    await user.type(screen.getByPlaceholderText("example@algoga.com"), "a");

    expect(onChange).toHaveBeenCalledWith("email", "a");
    expect(setServerError).toHaveBeenCalledWith({ field: "", message: "" });
  });

  test("이메일 인증번호 확인에 성공하면 인증 완료 메시지가 보인다", async () => {
    const user = userEvent.setup();

    (sendSignupEmailCode as jest.Mock).mockResolvedValueOnce(undefined);
    (verifySignupEmailCode as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <RegisterInfoForm
        formData={createFormData({ email: "test@example.com" })}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "인증: 이메일 인증번호 발송" }));
    await user.type(await screen.findByPlaceholderText("인증번호 입력"), "123456");
    await user.click(screen.getByRole("button", { name: "확인: 이메일 인증번호 확인" }));

    expect(await screen.findByText("이메일 인증이 완료되었습니다.")).toBeVisible();
    expect(verifySignupEmailCode).toHaveBeenCalledWith("test@example.com", "123456");
  });

  test("이메일 인증번호 확인에 실패하면 실패 메시지가 보인다", async () => {
    const user = userEvent.setup();

    (sendSignupEmailCode as jest.Mock).mockResolvedValueOnce(undefined);
    (verifySignupEmailCode as jest.Mock).mockRejectedValueOnce(
      new Error("인증번호가 일치하지 않습니다.")
    );

    render(
      <RegisterInfoForm
        formData={createFormData({ email: "test@example.com" })}
        onChange={jest.fn()}
        onNext={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "인증: 이메일 인증번호 발송" }));
    await user.type(await screen.findByPlaceholderText("인증번호 입력"), "000000");
    await user.click(screen.getByRole("button", { name: "확인: 이메일 인증번호 확인" }));

    expect(await screen.findByText("인증번호가 일치하지 않습니다.")).toBeVisible();
  });

  test("유입 경로에서 기타를 선택하면 직접 입력창이 보인다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <RegisterInfoForm
        formData={createFormData()}
        onChange={onChange}
        onNext={jest.fn()}
      />
    );

    const signupPathSelect = screen.getAllByRole("combobox").at(-1);

    expect(signupPathSelect).toBeDefined();

    await user.selectOptions(signupPathSelect!, "etc");

    expect(onChange).toHaveBeenCalledWith("signupPath", "");
    expect(screen.getByPlaceholderText("유입 경로를 직접 입력해주세요")).toBeVisible();
  });

  test("유입 경로에서 일반 항목을 선택하면 해당 값이 저장되고 직접 입력창은 닫힌다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <RegisterInfoForm
        formData={createFormData({ signupPath: "직접입력" })}
        onChange={onChange}
        onNext={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText("유입 경로를 직접 입력해주세요")).toBeVisible();

    const signupPathSelect = screen.getAllByRole("combobox").at(-1);

    await user.selectOptions(signupPathSelect!, "search");

    expect(onChange).toHaveBeenCalledWith("signupPath", "search");
    expect(screen.queryByPlaceholderText("유입 경로를 직접 입력해주세요")).not.toBeInTheDocument();
  });

  test("필수 정보와 인증을 모두 완료하면 다음 단계로 이동한다", async () => {
    const user = userEvent.setup();
    const onNext = jest.fn();

    (checkUsernameDuplicate as jest.Mock).mockResolvedValueOnce(true);
    (sendSignupEmailCode as jest.Mock).mockResolvedValueOnce(undefined);
    (verifySignupEmailCode as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <RegisterInfoFormHarness
        initialFormData={createFormData({
          name: "김알고",
          username: "testuser",
          password: "password123",
          passwordConfirm: "password123",
          email: "test@example.com",
          phone: "010-1234-5678",
          birthDate: "2000-01-01",
          gender: "MALE",
          nickname: "알고가조아",
        })}
        onNext={onNext}
      />
    );

    await user.click(screen.getByRole("button", { name: "중복 확인: 사용자 이름 검사" }));
    expect(await screen.findByText("사용 가능한 아이디입니다.")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "인증: 이메일 인증번호 발송" }));
    await user.type(await screen.findByPlaceholderText("인증번호 입력"), "123456");
    await user.click(screen.getByRole("button", { name: "확인: 이메일 인증번호 확인" }));
    expect(await screen.findByText("이메일 인증이 완료되었습니다.")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "다음 단계로 이동" }));

    expect(onNext).toHaveBeenCalledTimes(1);
  });

  test("소셜 회원가입은 아이디와 비밀번호 없이 다음 단계로 이동할 수 있다", async () => {
    const user = userEvent.setup();
    const onNext = jest.fn();

    render(
      <RegisterInfoForm
        formData={createFormData({
          name: "김알고",
          email: "social@example.com",
          phone: "010-1234-5678",
          birthDate: "2000-01-01",
          gender: "MALE",
          nickname: "알고가조아",
          socialType: "GOOGLE",
        })}
        onChange={jest.fn()}
        onNext={onNext}
        isSocialSignup
      />
    );

    await user.click(screen.getByRole("button", { name: "다음 단계로 이동" }));

    expect(onNext).toHaveBeenCalledTimes(1);
    expect(screen.queryByPlaceholderText("4자 이상 20자 이하")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("8자 이상 영문, 숫자 조합")).not.toBeInTheDocument();
  });
});
