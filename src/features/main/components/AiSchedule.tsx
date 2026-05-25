import Link from "next/link";

export default function AiSchedule() {

    return (
        <div className="flex-1 bg-[#439A97] rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center">
                <img src="images/AiIcon.svg" alt="ai"/>
                <p className="text-lg font-bold text-white pl-3">AI 여행 일정 추천</p>
            </div>
            <p className="text-lg text-white mt-10 pl-5 pr-5">목적지와 여행 스타일을 알려주시면 AI가 최적의 일정을 만들어드립니다. 항공·호텔 예약까지 한 번에!</p>
            <Link href='/'> {/*나중에 ai 일정 만들기에 해당하는 주소 넣기*/}
            <button className="w-full border border-white/30 bg-white/15 hover:bg-white/25 text-white py-3.5 rounded-2xl text-sm font-semibold flex justify-center items-center gap-1.5 mt-10">
                <span className="text-sm">✨</span>
                <span>AI 일정 만들기 ➔</span>
            </button>
            </Link>
        </div>
        
    );
}