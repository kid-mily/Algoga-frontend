import NoticeItem from "./NoticeItem";
import { getMainNoticeViewModel } from "../utils/notice.utils";
import type { Notice } from "@/features/notice/components/types";

interface NoticeListProps {
    notices: Notice[];
}

export default function NoticeList({ notices }: NoticeListProps) {
    const items = notices.flatMap((notice) => {
        const item = getMainNoticeViewModel(notice);
        return item ? [item] : [];
    });

    if (items.length === 0) {
        return (
        <p className="py-6 text-center text-sm text-gray-400">
            등록된 공지사항이 없습니다.
        </p>
        );
    }

    return (
        <ul className="divide-y divide-gray-100">
        {items.map((notice) => (
            <NoticeItem key={notice.noticeId} {...notice} />
        ))}
        </ul>
    );
}