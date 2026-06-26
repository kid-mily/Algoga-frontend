import Image from "next/image";

interface CertificateCardProps {
  userName: string;
  courseTitle: string;
  completedDate: string;
  certificateNumber: string;
}

export default function CertificateCard({
  userName,
  courseTitle,
  completedDate,
  certificateNumber,
}: CertificateCardProps) {
  return (
    <section className="h-[460px] w-[760px] shrink-0 rounded-md border-2 border-[#5F9C98] bg-[#FFFEFB] p-3 shadow-sm">
      <div className="relative flex h-full flex-col items-center border border-[#BFD7D5] px-14 py-8 text-center">
        {/* 상단 로고 */}
        <div className="mx-auto flex justify-center items-center">
            <Image 
              src="/images/medal.svg" 
              alt="메달 이미지"
              width={36} 
              height={36} 
            />
        </div>

        {/* 수료증 제목 */}
        <p className="mt-4 text-xs font-semibold text-[#7B9694]">
          CERTIFICATE OF COMPLETION
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-wide text-[#0A1628]">
          수료증
        </h1>

        <div className="mt-3 w-20 rounded-full bg-[#5F9C98]" />

        <p className="mt-3 text-sm leading-6 text-[#718096]">
          위 사람은 알고가에서 제공하는 교육 과정을
          <br />
          성실히 이수하였으므로 이 수료증을 수여합니다.
        </p>

        {/* 사용자 이름 */}
        <p className="mt-5 min-w-[240px] border-b border-[#BFD0CF] px-8 pb-2 text-3xl font-bold text-[#0A1628]">
          {userName}
        </p>

        {/* 강의명 */}
        <p className="mt-5 text-xs font-medium text-[#8A9BB0]">
          교육 과정
        </p>

        <h2 className="mt-2 text-xl font-bold text-[#5F9C98]">
          「{courseTitle}」
        </h2>

        {/* 하단 정보 */}
        <div className="mt-auto flex w-full items-end justify-between">
          <div className="text-left text-xs">
            <p className="text-[#9AA8B7]">수료일</p>

            <p className="mt-1 font-semibold text-[#0A1628]">
              {completedDate}
            </p>
          </div>

          <div>
            <Image
              src="/images/algoga-logo.png"
              alt=""
              width={128}
              height={128}
            />
          </div>

          <div className="text-right text-xs">
            <p className="text-[#9AA8B7]">인증번호</p>

            <p className="mt-1 font-mono font-semibold text-[#0A1628]">
              {certificateNumber}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
