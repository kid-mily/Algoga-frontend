import { adminApi, api, ApiResult, unwrapData } from "@/lib/api";
import {
  AdminNotice,
  AdminNoticeApiRecord,
  getNoticeTagLabel,
  NoticeFormData,
  NoticeTag,
  NoticeTagOption,
  noticeTagOptions,
} from "@/features/csadmin/notice/types";

const formatDateTime = (value: string | undefined) => {
  if (!value) return "-";

  const normalizedValue = value.trim();
  const localDateTimeMatch = normalizedValue.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::\d{2})?$/
  );

  if (localDateTimeMatch) {
    const [, year, month, day, hour, minute] = localDateTimeMatch;

    return `${year}.${month}.${day} ${hour}:${minute}`;
  }

  const localDateMatch = normalizedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (localDateMatch) {
    const [, year, month, day] = localDateMatch;

    return `${year}.${month}.${day}`;
  }

  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) return normalizedValue;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hour}:${minute}`;
};

const unwrapList = (data: unknown): AdminNoticeApiRecord[] => {
  if (Array.isArray(data)) return data as AdminNoticeApiRecord[];

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.content)) return record.content as AdminNoticeApiRecord[];
    if (Array.isArray(record.notices)) return record.notices as AdminNoticeApiRecord[];
    if (Array.isArray(record.items)) return record.items as AdminNoticeApiRecord[];
  }

  return [];
};

const unwrapTagList = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.tags)) return record.tags;
    if (Array.isArray(record.content)) return record.content;
    if (Array.isArray(record.items)) return record.items;
  }

  return [];
};

const normalizeNoticeTagOption = (item: unknown): NoticeTagOption | null => {
  if (typeof item === "string") {
    return { value: item, label: getNoticeTagLabel(item) };
  }

  if (!item || typeof item !== "object") return null;

  const record = item as Record<string, unknown>;
  const value = record.code ?? record.value ?? record.type ?? record.tag ?? record.name;

  if (typeof value !== "string" || !value.trim()) return null;

  const label = record.description ?? record.label ?? record.title;

  return {
    value,
    label: typeof label === "string" && label.trim() ? label : getNoticeTagLabel(value),
  };
};


export const normalizeNotice = (item: AdminNoticeApiRecord): AdminNotice | null => {
  const noticeId = item.noticeId ?? item.id;

  if (
    typeof noticeId !== "number" ||
    !Number.isSafeInteger(noticeId) ||
    noticeId <= 0
  ) {
    return null;
  }

  const tag = item.tag ?? item.type ?? "NOTICE";

  return {
    noticeId,
    displayId: `N${String(noticeId).padStart(3, "0")}`,
    title: item.title ?? "-",
    content: item.content ?? "",
    tag,
    tagLabel: getNoticeTagLabel(tag),
    createdAt: formatDateTime(
      item.createdAt ??
        item.created_at ??
        item.createdDate ??
        item.created_date ??
        item.registeredAt ??
        item.registered_at ??
        item.date
    ),
    updatedAt: formatDateTime(
      item.updatedAt ?? item.updated_at ?? item.updatedDate ?? item.updated_date
    ),
    viewCount: item.viewCount ?? 0,
  };
};

export const getAdminNotices = async ({
  tag = "ALL",
  index = 0,
  signal,
}: {
  tag?: NoticeTag;
  index?: number;
  signal?: AbortSignal;
} = {}): Promise<AdminNotice[]> => {
  const response = await api.get<ApiResult<unknown>>(
    `/api/v1/public/notices/${tag}/${index}`,
    {
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return unwrapList(data).flatMap((item) => {
    const notice = normalizeNotice(item);

    return notice ? [notice] : [];
  });
};

export const getNoticeTags = async (
  signal?: AbortSignal
): Promise<NoticeTagOption[]> => {
  const response = await api.get<ApiResult<unknown>>(
    "/api/v1/public/notices/tags",
    {
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);
  const tags = unwrapTagList(data)
    .map(normalizeNoticeTagOption)
    .filter((tag): tag is NoticeTagOption => Boolean(tag));

  return tags.length > 0 ? tags : noticeTagOptions;
};

export const getAdminNoticeById = async (
  noticeId: number,
  signal?: AbortSignal
): Promise<AdminNotice | null> => {
  const response = await api.get<ApiResult<AdminNoticeApiRecord | null>>(
    `/api/v1/public/notices/${noticeId}`,
    {
      suppressGlobalError: true,
      signal,
    }
  );
  const data = unwrapData(response);

  return data ? normalizeNotice(data) : null;
};

const toPayload = (formData: NoticeFormData) => ({
  title: formData.title.trim(),
  content: formData.content.trim(),
  type: formData.tag,
});

export const registerAdminNotice = async (
  formData: NoticeFormData
): Promise<void> => {
  await adminApi.post<ApiResult<string | null>>(
    "/api/v1/admin/notices/register",
    toPayload(formData)
  );
};

export const modifyAdminNotice = async (
  noticeId: number,
  formData: NoticeFormData
): Promise<void> => {
  await adminApi.put<ApiResult<string | null>>(
    `/api/v1/admin/notices/modify/${noticeId}`,
    toPayload(formData)
  );
};


export const deleteAdminNotice = async (noticeId: number): Promise<void> => {
  await adminApi.delete<ApiResult<null>>(`/api/v1/admin/notices/${noticeId}`);
};
