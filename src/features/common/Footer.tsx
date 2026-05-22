export default function Footer() {
    return (
        <footer className="bg-[#286E6B] text-gray-300">
            <div className="max-w-[1440px] mx-auto px-20 py-10">

        <div className="flex items-start gap-30">
            {/* 로고 */}
            <div className="flex flex-col gap-4">
                <img src="/images/알고가_로고.png" alt="로고" className="w-[130px] h-[45px]"/>
                <p className="leading-relaxed">AI 기반 여행 학습 및 <br /> 맞춤 여행 플랫폼</p>
            </div>

            {/* 서비스 */}
            <div className="flex flex-col gap-4">
                <p className="font-bold text-lg">서비스</p>
                <p>여행 강의</p>
                <p>AI 일정 추천</p>
                <p>여행 예약</p> 
                <p>커뮤니티</p>
            </div>

            {/* 고객지원 */}
            <div className="flex flex-col gap-4">
                <p className="font-bold text-lg">고객지원</p>
                <p>공지사항</p>
                <p>1:1 문의</p>
            </div>

            {/* 문의 */}
            <div className="flex flex-col gap-4">
                <p className="font-bold text-lg">문의</p>
                <p>support@algoag.com</p>
                <p>02-1234-5678</p>
            </div>
        </div>

        <hr className="my-8 border-white/50" />

        <div className="flex gap-5 text-sm p-5">
            <p>회사소개</p> 
            <p>이용약관</p> 
            <p>개인정보처리방침</p> 
            <p>사업자정보확인</p>
        </div>
        <div className="flex flex-col p-5">
            <p>(주)알고가 | 대표이사: 김진도 | 사업자등록번호: 123-45-67890</p> 
            <p> 경기도 성남시 수정구 산성대로 553 박애관 6층 | 통신판매업신고: 2026-경기성남-12345</p>
            <br />
            <p>© 2026 Algoga. All rights reserved.</p>
        </div>
    </div>
</footer>
    );
}