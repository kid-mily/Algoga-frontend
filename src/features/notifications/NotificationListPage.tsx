"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  NotificationApiError,
} from "@/features/services/notification.service";
import { formatRelativeTime } from "./notification.util";
import { NOTIFICATION_TYPE_ICON } from "./notificationIcon";
import { getNotificationTargetPath } from "./notificationRouting";
import type { NotificationApiItem } from "./types";

type NotificationTab = "all" | "unread";

const TABS: { value: NotificationTab; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "unread", label: "읽지 않음" },
];

const notifyChanged = () => {
  window.dispatchEvent(new Event("notifications-changed"));
};

export default function NotificationListPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationApiItem[]>(
    []
  );
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNotifications = useCallback(
    async (page: number, tab: NotificationTab) => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getNotifications({
          page,
          isRead: tab === "unread" ? false : undefined,
        });

        setNotifications(data.notifications);
        setTotalElements(data.totalElements);
        setTotalPages(Math.max(data.totalPages, 1));
      } catch (error) {
        if (
          error instanceof NotificationApiError &&
          (error.status === 401 || error.status === 403)
        ) {
          router.replace("/auth/login");
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "알림 목록을 불러오지 못했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    void fetchNotifications(currentPage, activeTab);
  }, [fetchNotifications, currentPage, activeTab]);

  const selectedNotification =
    notifications.find((item) => item.notificationId === selectedId) ?? null;

  const handleChangeTab = (tab: NotificationTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedId(null);
  };

  const handleSelect = async (item: NotificationApiItem) => {
    const targetPath = getNotificationTargetPath(
      item.type,
      item.referenceId
    );

    if (!item.isRead) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === item.notificationId
            ? { ...n, isRead: true }
            : n
        )
      );

      try {
        await markNotificationAsRead(item.notificationId);
        notifyChanged();
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    }

    if (targetPath) {
      router.push(targetPath);
      return;
    }

    setSelectedId(item.notificationId);
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);

      if (selectedId === notificationId) setSelectedId(null);
      notifyChanged();
      await fetchNotifications(currentPage, activeTab);
    } catch (error) {
      console.error("알림 삭제 실패:", error);
      alert(
        error instanceof Error ? error.message : "알림 삭제에 실패했습니다."
      );
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();

      setSelectedId(null);
      setCurrentPage(1);
      notifyChanged();
      await fetchNotifications(1, activeTab);
    } catch (error) {
      console.error("알림 전체 삭제 실패:", error);
      alert(
        error instanceof Error
          ? error.message
          : "알림 전체 삭제에 실패했습니다."
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      notifyChanged();
      await fetchNotifications(currentPage, activeTab);
    } catch (error) {
      console.error("알림 전체 읽음 처리 실패:", error);
      alert(
        error instanceof Error
          ? error.message
          : "알림 전체 읽음 처리에 실패했습니다."
      );
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F5F7FA]">
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xl font-bold text-[#0A1628]"
            >
              <span aria-hidden="true">‹</span>
              알림
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-[#E5EDF5]">
          <div className="flex gap-6">
            {TABS.map((tab) => {
              const isActive = tab.value === activeTab;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleChangeTab(tab.value)}
                  className={`flex items-center gap-1.5 border-b-2 px-1 pb-3 text-sm font-bold transition-colors ${
                    isActive
                      ? "border-[#439A97] text-[#439A97]"
                      : "border-transparent text-[#0A1628] hover:text-[#439A97]"
                  }`}
                >
                  {tab.label}
                  {tab.value === "all" && ` (${totalElements})`}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pb-3">
            <button
              type="button"
              onClick={handleDeleteAll}
              className="text-sm font-semibold text-[#8A9BB0] hover:text-red-500"
            >
              모두 삭제
            </button>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-sm font-semibold text-[#439A97] hover:underline"
            >
              모두 읽음
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-2xl border border-[#E5EDF5] bg-white">
            {isLoading ? (
              <div className="flex min-h-40 items-center justify-center">
                <p className="text-sm text-gray-400">불러오는 중...</p>
              </div>
            ) : errorMessage ? (
              <div className="flex min-h-40 items-center justify-center">
                <p className="text-sm text-red-500">{errorMessage}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex min-h-40 items-center justify-center">
                <p className="text-sm text-gray-400">알림이 없습니다.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <NotificationRow
                  key={item.notificationId}
                  item={item}
                  isSelected={item.notificationId === selectedId}
                  onSelect={() => handleSelect(item)}
                  onDelete={() => handleDelete(item.notificationId)}
                />
              ))
            )}
          </div>

          <NotificationDetailPanel
            notification={selectedNotification}
            onDelete={() =>
              selectedNotification &&
              handleDelete(selectedNotification.notificationId)
            }
          />
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                    pageNumber === currentPage
                      ? "bg-[#439A97] text-white"
                      : "border border-[#E5EDF5] bg-white text-[#8A9BB0] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}

interface NotificationRowProps {
  item: NotificationApiItem;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function NotificationRow({
  item,
  isSelected,
  onSelect,
  onDelete,
}: NotificationRowProps) {
  return (
    <div
      onClick={onSelect}
      className={`flex cursor-pointer items-center gap-3 border-b border-[#F1F3F5] px-5 py-4 transition ${
        isSelected ? "bg-[#EEF8F7]" : "hover:bg-[#FAFBFC]"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F5F4]">
        <Image
          src={NOTIFICATION_TYPE_ICON[item.type]}
          alt=""
          width={18}
          height={18}
          aria-hidden="true"
        />
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm ${
            item.isRead ? "font-medium text-[#4B5563]" : "font-bold text-[#0A1628]"
          }`}
        >
          {item.message}
        </p>

        <p className="mt-0.5 text-xs text-[#8A9BB0]">
          {formatRelativeTime(item.createdAt)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {!item.isRead && (
          <span className="h-2 w-2 rounded-full bg-[#439A97]" />
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          className="text-xs font-semibold text-[#B0B8C1] hover:text-red-500"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

interface NotificationDetailPanelProps {
  notification: NotificationApiItem | null;
  onDelete: () => void;
}

function NotificationDetailPanel({
  notification,
  onDelete,
}: NotificationDetailPanelProps) {
  if (!notification) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-[#E5EDF5] bg-white text-center">
        <p className="text-sm text-[#8A9BB0]">
          알림을 선택하면
          <br />
          상세 내용을 확인할 수 있습니다
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5EDF5] bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F5F4]">
          <Image
            src={NOTIFICATION_TYPE_ICON[notification.type]}
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
          />
        </span>

        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0A1628]">
            {notification.message}
          </p>

          <p className="mt-1 text-xs text-[#8A9BB0]">
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>
      </div>

      {notification.detail && (
        <p className="mt-4 rounded-xl bg-[#F8FAFC] p-4 text-sm leading-6 text-[#4B5563]">
          &ldquo;{notification.detail}&rdquo;
        </p>
      )}

      <button
        type="button"
        onClick={onDelete}
        className="mt-4 text-sm font-semibold text-red-500 hover:underline"
      >
        알림 삭제
      </button>
    </div>
  );
}
