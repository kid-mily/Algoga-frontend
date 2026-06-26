import Image from "next/image";
import Link from "next/link";
import carrierImage from "@/../public/images/carrier.png";
import carrier from "@/../public/images/carrierflight.png";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
      <section className="flex w-full max-w-[1100px] flex-col items-center justify-center gap-10 md:flex-row md:gap-20">
        <div className="flex -translate-y-8 flex-col items-start md:-translate-y-14">
          <Image
            src={carrier}
            alt="접근 권한 없음"
            width={420}
            height={420}
            priority
            className="h-auto w-[300px] md:w-[390px]"
          />

          <h1 className="mb-5 text-[56px] font-extrabold leading-none text-[#174D4B] md:text-[64px]">
            403 ERROR
          </h1>

          <h2 className="mb-3 text-[28px] font-extrabold text-[#174D4B]">
            접근 권한이 없습니다
          </h2>

          <p className="mb-8 text-[18px] font-medium text-[#344054]">
            이 페이지를 볼 수 있는 권한이 없는 계정입니다.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/adminlogin"
              className="flex h-[48px] items-center gap-2 rounded-[10px] bg-[#2C9C94] px-6 text-[16px] font-bold text-white shadow-sm transition hover:bg-[#248982]"
            >
              관리자 로그인으로 가기
            </Link>

            <Link
              href="/"
              className="flex h-[48px] items-center gap-2 rounded-[10px] border border-[#2C9C94] bg-white px-6 text-[16px] font-bold text-[#2C9C94] transition hover:bg-[#F0FAF9]"
            >
              홈으로 가기
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src={carrierImage}
            alt="접근 권한 없음"
            width={420}
            height={420}
            priority
            className="h-auto w-[360px] md:w-[420px]"
          />
        </div>
      </section>
    </main>
  );
}