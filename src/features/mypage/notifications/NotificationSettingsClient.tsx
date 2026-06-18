"use client";

import { useState } from "react";
import NotificationToggleItem from "./NotificationToggleItem";

const notificationItems = [
  {
    id: "learning",
    title: "학습 알림",
    description:
      "수강 신청, 강의 수강 완료, D-day 일정 등 학습 진행과 관련된 알림을 받을 수 있어요.",
  },
  {
    id: "qna",
    title: "Q&A 알림",
    description:
      "작성한 강의 Q&A에 답변이 등록되면 알림을 받을 수 있어요.",
  },
  {
    id: "community",
    title: "커뮤니티 댓글 알림",
    description:
      "작성한 게시글에 댓글이 등록되거나 작성한 댓글에 답글이 달리면 알림을 받을 수 있어요.",
  },
  {
    id: "notice",
    title: "공지사항 알림",
    description:
      "서비스 이용 안내, 점검 일정, 기능 업데이트 등 새로운 공지사항을 받을 수 있어요.",
  },
  {
    id: "inquiry",
    title: "문의 답변 알림",
    description:
      "등록한 문의에 답변이 작성되면 알림과 이메일로 안내를 받을 수 있어요.",
  },
  {
    id: "friend",
    title: "친구 알림",
    description:
      "친구 요청이 도착하거나 친구 요청이 수락되었을 때 알림을 받을 수 있어요.",
  },
];

export default function NotificationSettingsClient() {
  const [settings, setSettings] = useState<Record<string, boolean>>(
    notificationItems.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {})
  );

  const handleToggle = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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