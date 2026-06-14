"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  // 시간이 종료되었을 때 실행되는 함수
  onTimeEnd: () => void;
}

export default function Timer({ onTimeEnd }: TimerProps) {
  const [seconds, setSeconds] = useState(600);  // 10분

  useEffect(() => {
    // 시간이 끝나면 부모 컴포넌트에 알려줌
    if (seconds === 0) {
      onTimeEnd();
      return;
    }

    // 1초마다 시간을 1초씩 감소
    const timerId = window.setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // 기존 타이머 제거
    return () => {
      window.clearTimeout(timerId);
    };
  }, [seconds, onTimeEnd]);

  // 분 계산
  const minutes = Math.floor(seconds / 60);

  // 초 계산
  const remainingSeconds = seconds % 60;

  // 두 자리 숫자로 표시
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return (
    <time className="text-2xl font-bold text-[#E65100]">
      {formattedMinutes}:{formattedSeconds}
    </time>
  );
}