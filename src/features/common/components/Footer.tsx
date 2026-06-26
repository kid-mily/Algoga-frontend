export default function Footer() {
    return (
        <footer className="bg-[#286E6B] text-gray-300">
            <div className="mx-auto max-w-[1440px] px-16 py-6">
                <div className="flex items-start gap-24">
                    {/* 로고 */}
                    <div className="flex flex-col gap-2">
                        <img
                        src="/images/algoga-logo.png"
                        alt="로고"
                        className="h-[36px] w-[105px]"
                        />
                        <p className="text-sm leading-relaxed">
                        AI 기반 여행 학습 및 <br /> 맞춤 여행 플랫폼
                        </p>
                    </div>

                    {/* 서비스 */}
                    <div className="flex flex-col gap-2 text-sm">
                        <p className="font-bold text-base text-white">서비스</p>
                        <p>여행 강의</p>
                        <p>AI 일정 추천</p>
                        <p>여행 예약</p>
                        <p>커뮤니티</p>
                    </div>

                    {/* 고객지원 */}
                    <div className="flex flex-col gap-2 text-sm">
                        <p className="font-bold text-base text-white">고객지원</p>
                        <p>공지사항</p>
                        <p>1:1 문의</p>
                    </div>

                    {/* 문의 */}
                    <div className="flex flex-col gap-2 text-sm">
                        <p className="font-bold text-base text-white">문의</p>
                        <p>support@algoag.com</p>
                        <p>02-1234-5678</p>
                    </div>
                </div>

                <hr className="my-5 border-white/40" />

                <div className="flex gap-5 text-xs">
                    <p>회사소개</p>
                    <p>이용약관</p>
                    <p>개인정보처리방침</p>
                    <p>사업자정보확인</p>
                </div>

                <div className="mt-3 flex flex-col gap-1 text-xs leading-relaxed">
                    <p>(주)알고가 | 대표이사: 김진도 | 사업자등록번호: 123-45-67890</p>
                    <p>
                        경기도 성남시 수정구 산성대로 553 박애관 6층 |
                        통신판매업신고: 2026-경기성남-12345
                    </p>
                    <p className="mt-2">© 2026 Algoga. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
