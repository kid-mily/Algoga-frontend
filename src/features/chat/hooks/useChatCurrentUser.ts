import { useEffect, useRef, useState } from "react";
import { getMe } from "@/features/services/user.service";

type UseChatCurrentUserOptions = {
  isAdminPage: boolean;
  onCleared: () => void;
};

// 로그인 상태(currentUserId) 동기화만 담당 — 로그아웃/비로그인 시 onCleared로 알려줌
export const useChatCurrentUser = ({
  isAdminPage,
  onCleared,
}: UseChatCurrentUserOptions) => {
  const [currentUserId, setCurrentUserId] = useState<number>();
  const onClearedRef = useRef(onCleared);

  useEffect(() => {
    onClearedRef.current = onCleared;
  }, [onCleared]);

  useEffect(() => {
    if (isAdminPage) {
      const timeoutId = window.setTimeout(() => {
        setCurrentUserId(undefined);
        onClearedRef.current();
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    let isMounted = true;

    const syncCurrentUser = async () => {
      try {
        const user = await getMe();
        if (!isMounted) return;

        const nextUserId =
          user?.userId && user.userId > 0 ? user.userId : undefined;

        setCurrentUserId(nextUserId);

        if (!nextUserId) {
          onClearedRef.current();
        }
      } catch {
        if (!isMounted) return;

        setCurrentUserId(undefined);
        onClearedRef.current();
      }
    };

    void syncCurrentUser();

    window.addEventListener("auth-state-changed", syncCurrentUser);

    return () => {
      isMounted = false;
      window.removeEventListener("auth-state-changed", syncCurrentUser);
    };
  }, [isAdminPage]);

  return currentUserId;
};
