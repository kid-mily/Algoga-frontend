import Link from "next/link";

export default function RegisterHeader() {
  return (
    <div className="flex items-center gap-4">
      {/* 뒤로가기 */}
      <Link
        href="/auth/login"
        className="text-[24px] text-[#98A2B3]"
      >
        ‹
      </Link>
      {/* 로고 */}
      <div className="flex items-center justify-center">
          <img
            src="/images/알고가_로고_.png"
            alt="로고"
            className="h-[45px] w-auto cursor-pointer"
      />
      </div>
      {/* 텍스트 */}
      <span className="text-[24px] font-semibold text-[#439A97]">
        알고가 회원가입
      </span>
    </div>
  );
}