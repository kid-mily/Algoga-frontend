"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationToggleItem from "./NotificationToggleItem";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import {
  getNotificationSettings,
  updateNotificationSettings,
  NotificationApiError,
  type NotificationSettings,
} from "@/features/services/notification.service";

const notificationItems: {
  id: keyof NotificationSettings;
  title: string;
  description: string;
}[] = [
  {
    id: "learningEnabled",
    title: "학습 알림",
    description:
      "수강 신청, 강의 수강 완료, D-day 일정 등 학습 진행과 관련된 알림을 받을 수 있어요.",
  },
  {
    id: "qnaEnabled",
    title: "Q&A 알림",
    description:
      "작성한 강의 Q&A에 답변이 등록되면 알림을 받을 수 있어요.",
  },
  {
    id: "communityEnabled",
    title: "커뮤니티 댓글 알림",
    description:
      "작성한 게시글에 댓글이 등록되거나 작성한 댓글에 답글이 달리면 알림을 받을 수 있어요.",
  },
  {
    id: "noticeEnabled",
    title: "공지사항 알림",
    description:
      "서비스 이용 안내, 점검 일정, 기능 업데이트 등 새로운 공지사항을 받을 수 있어요.",
  },
  {
    id: "inquiryEnabled",
    title: "문의 답변 알림",
    description:
      "등록한 문의에 답변이 작성되면 알림과 이메일로 안내를 받을 수 있어요.",
  },
  {
    id: "friendEnabled",
    title: "친구 알림",
    description:
      "친구 요청이 도착하거나 친구 요청이 수락되었을 때 알림을 받을 수 있어요.",
  },
];

export default function NotificationSettingsClient() {
  const router = useRouter();

  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [savingId, setSavingId] = useState<
    keyof NotificationSettings | null
  >(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getNotificationSettings();
        if (!active) return;

        setSettings(data);
      } catch (error) {
        if (!active) return;

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
            : "알림 설정을 불러오지 못했습니다."
        );
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [router]);

  const handleToggle = async (id: keyof NotificationSettings) => {
    if (!settings || savingId) return;

    const nextSettings = { ...settings, [id]: !settings[id] };

    setSettings(nextSettings);
    setSavingId(id);

    try {
      const updated = await updateNotificationSettings(nextSettings);
      setSettings(updated);
    } catch (error) {
      console.error("알림 설정 변경 실패:", error);

      // 실패하면 토글을 원래 상태로 되돌린다
      setSettings(settings);

      alert(
        error instanceof Error
          ? error.message
          : "알림 설정 변경에 실패했습니다."
      );
    } finally {
      setSavingId(null);
    }
  };

  if (isLoading) {
    return (
      <section className="flex min-h-[240px] items-center justify-center rounded-2xl bg-white shadow-sm">
        <LoadingSpinner />
      </section>
    );
  }

  if (errorMessage || !settings) {
    return (
      <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-red-500">
          {errorMessage || "알림 설정을 불러오지 못했습니다."}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white px-6 py-5 shadow-sm">
      <div className="rounded-2xl border border-[#F3C74D] bg-[#FFFBEA] px-4 py-3 text-xs font-medium text-[#9A6B00]">
        예약, 결제내역 등 필수적으로 안내되어야 하는 내용은 수신여부와 상관 없이 계속 발송됩니다.
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {notificationItems.map((item) => (
          <NotificationToggleItem
            key={item.id}
            title={item.title}
            description={item.description}
            checked={settings[item.id]}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
