export default function LoginForm() {
  return (
    <div className="w-[400px]">
      {/* 타이틀 */}
      <h1 className="text-[32px] font-bold text-[#111827]">
        로그인
      </h1>

      <p className="mt-2 text-[15px] text-[#98A2B3]">
        계정에 로그인하세요
      </p>

      <form className="mt-5">
        {/* 아이디 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">
            아이디
          </label>

          <input
            type="email"
            placeholder="아이디를 입력해주세요"
            className="mt-3 h-[56px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 비밀번호 */}
        <div className="mt-6">
          <label className="text-[16px] font-semibold text-[#111827]">
            비밀번호
          </label>

          <div className="relative mt-3">
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              className="h-[56px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 pr-14 text-[15px] outline-none placeholder:text-[#98A2B3]"
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[16px]"
            >
              눈아이콘 넣을 자리
            </button>
          </div>
        </div>

        {/* 옵션 */}
        <div className="mt-5 flex items-center justify-between">
          <label className="flex items-center gap-2 text-[14px] text-[#344054]">
            <input type="checkbox" />
            로그인 상태 유지
          </label>

          <div className="flex items-center gap-2 text-[14px] text-[#6B9D9B]">
            <button type="button">
              아이디 찾기
            </button>

            <span>|</span>

            <button type="button">
              비밀번호 찾기
            </button>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="mt-6 h-[56px] w-full rounded-[16px] bg-[#6D9D9B] text-[18px] font-semibold text-white"
        >
          로그인
        </button>

        {/* 구분선 */}
        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E4E7EC]" />

          <span className="text-[12px] text-[#98A2B3]">
            또는 소셜 로그인
          </span>

          <div className="h-px flex-1 bg-[#E4E7EC]" />
        </div>

        {/* 카카오 */}
        <button
          type="button"
          className="mt-5 flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#FEE500] text-[17px] font-semibold text-black"
        >
          카카오로 계속하기
        </button>

        {/* 구글 */}
        <button
          type="button"
          className="mt-4 flex h-[56px] w-full items-center justify-center rounded-[16px] border border-[#D0D5DD] bg-[#F2F4F7] text-[17px] font-semibold text-[#344054]"
        >
          구글로 계속하기
        </button>

        {/* 회원가입 */}
        <div className="mt-8 text-center text-[14px] text-[#98A2B3]">
          계정이 없으신가요?{" "}

          <button
            type="button"
            className="font-semibold text-[#6D9D9B]"
          >
            회원가입
          </button>
        </div>

        {/* 메인 이동 */}
        <button
          type="button"
          className="mt-4 block w-full text-center text-[14px] text-[#98A2B3]"
        >
          메인으로 돌아가기
        </button>
      </form>
    </div>
  );
}