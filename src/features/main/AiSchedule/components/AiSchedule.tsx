import Image from "next/image";
import Link from "next/link";

export default function AiSchedule() {
  return (
    <section className="rounded-2xl border border-gray-100 bg-[#439A97] p-5 shadow-sm">
        <header className="flex items-center">
            <Image
            src="/images/AiIcon.svg"
            alt="ai일정 추천 아이콘"
            aria-hidden="true"
            width={32}
            height={32}
            />

            <h2 className="pl-3 text-lg font-bold text-white">AI 여행 일정 추천</h2>
        </header>

        <p className="mt-8 px-1 text-base leading-7 text-white/90">
            목적지와 여행 스타일을 알려주시면 AI가 최적의 일정을 만들어드립니다.
        </p>
        <p className="px-1 text-base font-semibold leading-7 text-white">
            항공·호텔 예약까지 한 번에!
        </p>

        <Link
            href="/aischedule"
            className="mt-10 flex w-full items-center justify-center gap-1 rounded-2xl border border-white/30 bg-white/15 py-3.5 text-sm font-semibold text-white transition hover:bg-white/25"
        >
            <span aria-hidden="true">✨</span>
            <span>AI 일정 만들기</span>
            <span aria-hidden="true">→</span>
        </Link>
    </section>
  );
}
