import Link from "next/link";

export default function FindPwComplete() {
  return (
    <div className="flex w-[520px] flex-col items-center">
      {/* 아이콘 */}
      <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#439A97] text-[42px] text-white">
        ✉
      </div>

      {/* 타이틀 */}
      <h1 className="mt-8 text-[40px] font-bold text-[#111827]">
        이메일 전송 완료
      </h1>

      {/* 설명 */}
      <p className="mt-4 text-[18px] text-[#98A2B3]">
        임시 비밀번호가 이메일로 전송되었습니다
      </p>

      {/* 안내 박스 */}
      <div className="mt-10 w-full rounded-[28px] border border-[#D8E1F0] bg-[#F3F6FC] px-12 py-12">
        <p className="text-[18px] leading-[1.9] text-[#667085]">
            가입한 이메일로 임시 비밀번호를 전송했습니다.
        </p>

        <p className="mt-10 text-[18px] leading-[1.9] text-[#667085]">
            이메일을 확인하여 임시 비밀번호로 로그인한 후,
            반드시 비밀번호를 변경해주세요.
        </p>
        </div>

      {/* 추가 안내 */}
      <div className="mt-8 flex w-full items-center rounded-[20px] border border-[#E6C75A] bg-[#FFFBEF] px-8 py-6">
        <span className="text-[16px] text-[#B08B1A]">
          이메일이 도착하지 않았다면 스팸 메일함을 확인해주세요.
        </span>
      </div>

      {/* 로그인 버튼 */}
      <Link
        href="/user/auth/login"
        className="mt-10 flex h-[64px] w-full items-center justify-center rounded-[20px] bg-[#439A97] text-[20px] font-semibold text-white"
      >
        로그인 페이지로
      </Link>
    </div>
  );
}