import Image from "next/image";
import Link from "next/link";
import BackButton from "@/features/common/components/BackButton";
import carrierImage from "@/../public/images/carrierImage.png";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <section className="flex w-full max-w-[1100px] items-center justify-center gap-20">
        <div className="flex justify-center">
          <Image
            src={carrierImage}
            alt="길을 잃은 캐리어 캐릭터"
            width={420}
            height={420}
            priority
            className="h-auto w-[360px] md:w-[420px]"
          />
        </div>

        <div className="flex flex-col items-start">
          <h1 className="mb-5 text-[56px] font-extrabold leading-none text-[#174D4B] md:text-[64px]">
            404 ERROR
          </h1>

          <h2 className="mb-3 text-[28px] font-extrabold text-[#174D4B]">
            앗! 길을 잃으셨나요?
          </h2>

          <p className="mb-8 text-[18px] font-medium text-[#344054]">
            요청하신 강의나 페이지를 찾을 수 없습니다.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-[48px] items-center gap-2 rounded-[10px] bg-[#2C9C94] px-6 text-[16px] font-bold text-white shadow-sm transition hover:bg-[#248982]"
            >
              홈으로 가기
            </Link>
            <BackButton className="flex h-[48px] items-center gap-2 rounded-[10px] border border-[#2C9C94] bg-white px-6 text-[16px] font-bold text-[#2C9C94] transition hover:bg-[#F0FAF9]" />
          </div>
        </div>
      </section>
    </main>
  );
}