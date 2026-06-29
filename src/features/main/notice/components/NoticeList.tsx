import NoticeItem from "./NoticeItem";
import { getMainNoticeViewModel } from "../utils/notice.utils";
import type { MainNoticeSourceNotice } from "../types";

interface NoticeListProps {
    notices: MainNoticeSourceNotice[];
}

export default function NoticeList({ notices }: NoticeListProps) {
    const items = notices.map(getMainNoticeViewModel);

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