"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/features/services/notification.service";
import { formatRelativeTime } from "./notification.util";
import { NOTIFICATION_TYPE_ICON } from "./notificationIcon";
import { getNotificationTargetPath } from "./notificationRouting";
import type { NotificationApiItem } from "./types";

const PREVIEW_COUNT = 5;
const POLL_INTERVAL_MS = 30_000;

interface HeaderNotificationBellProps {
  isLoggedIn: boolean;
}

export default function HeaderNotificationBell({
  isLoggedIn,
}: HeaderNotificationBellProps) {
  const router = useRouter();

  const [unreadCount, setUnreadCount] = useState(0);
  const [previewItems, setPreviewItems] = useState<NotificationApiItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("읽지 않은 알림 개수 조회 실패:", error);
    }
  }, []);

  // 로그인 상태일 때만 30초 주기로 배지 갱신, 비로그인/언마운트 시 정리
  useEffect(() => {
    if (!isLoggedIn) return;

    void refreshUnreadCount();

    const intervalId = window.setInterval(refreshUnreadCount, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isLoggedIn, refreshUnreadCount]);

  // 전체 알림 페이지 등 다른 곳에서 읽음/삭제 처리를 했을 때도 배지를 즉시 갱신한다
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleNotificationsChanged = () => {
      void refreshUnreadCount();
    };

    window.addEventListener("notifications-changed", handleNotificationsChanged);

    return () => {
      window.removeEventListener(
        "notifications-changed",
        handleNotificationsChanged
      );
    };
  }, [isLoggedIn, refreshUnreadCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!panelRef.current) return;

      if (!panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpen = async () => {
    const next = !isOpen;
    setIsOpen(next);

    if (next) {
      try {
        const data = await getNotifications({ page: 1, size: PREVIEW_COUNT });
        setPreviewItems(data.notifications);
      } catch (error) {
        console.error("알림 목록 조회 실패:", error);
      }
    }
  };

  const handleSelectItem = async (item: NotificationApiItem) => {
    setIsOpen(false);

    const targetPath = getNotificationTargetPath(
      item.type,
      item.referenceId
    );

    try {
      await markNotificationAsRead(item.notificationId);
      window.dispatchEvent(new Event("notifications-changed"));
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }

    router.push(targetPath ?? "/notifications");
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setPreviewItems((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );
      void refreshUnreadCount();
    } catch (error) {
      console.error("알림 전체 읽음 처리 실패:", error);
    }
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        aria-label="알림 열기"
        className="relative flex h-6 w-6 items-center justify-center"
      >
        <Image
          src="/images/NoticeIcon.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
          className="cursor-pointer"
        />

        {isLoggedIn && unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-[3100] w-80 rounded-2xl border border-[#E5EAF1] bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0A1628]">알림</h2>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-xs font-semibold text-[#439A97] hover:underline"
            >
              모두 읽음
            </button>
          </div>

          <div className="mt-3 flex flex-col">
            {previewItems.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                알림이 없습니다.
              </p>
            ) : (
              previewItems.map((item) => (
                <button
                  key={item.notificationId}
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  className="flex w-full items-start gap-2 border-b border-[#F1F3F5] px-2 py-3 text-left transition last:border-b-0 hover:bg-[#F8FAFC]"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1F5F4]">
                    <Image
                      src={NOTIFICATION_TYPE_ICON[item.type]}
                      alt=""
                      width={16}
                      height={16}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="block truncate text-sm font-semibold text-[#0A1628]">
                        {item.message}
                      </span>

                      {!item.isRead && (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#439A97]" />
                      )}
                    </span>

                    <span className="mt-0.5 block text-xs text-[#8A9BB0]">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>

          <Link
            href="/notifications"
            onClick={() => setIsOpen(false)}
            className="mt-2 block border-t border-[#F1F3F5] pt-3 text-center text-sm font-semibold text-[#439A97] hover:underline"
          >
            전체 알림 보기
          </Link>
        </div>
      )}
    </div>
  );
}
