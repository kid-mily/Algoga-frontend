import { useEffect, useState } from "react";

export const useLoginLockTimer = () => {
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState(0);

  useEffect(() => {
    if (lockRemainingSeconds <= 0) return;

    const intervalId = window.setInterval(() => {
      setLockRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [lockRemainingSeconds]);

  const clearLockTimer = () => {
    setLockRemainingSeconds(0);
  };

  return {
    lockRemainingSeconds,
    setLockRemainingSeconds,
    clearLockTimer,
  };
};


