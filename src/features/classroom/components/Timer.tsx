'use client'

import { useState } from "react";


export default function TimerPage() {
    
    // 타이머 시간 설정
    const [seconds, setSeconds] = useState(600);  // 10분

    // 1초씩 줄어듦
    if (seconds > 0) {
        setTimeout(() => setSeconds(seconds - 1), 1000);
    }

    // 분:초
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');

    return (
        <div className="text-[#E65100] font-bold text-2xl">
            {min}:{sec} {seconds === 0 && "(시간 종료!)"}
        </div>
    );
}