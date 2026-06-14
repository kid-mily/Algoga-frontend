import { AdminNotice, emptyNoticeForm, NoticeFormData, NoticeTagOption, noticeTagOptions } from "./types";

export { emptyNoticeForm, noticeTagOptions };
export type { NoticeFormData, NoticeTagOption };

export const toNoticeFormData = (notice: AdminNotice): NoticeFormData => ({
  title: notice.title,
  content: notice.content,
  tag: notice.tag,
});
