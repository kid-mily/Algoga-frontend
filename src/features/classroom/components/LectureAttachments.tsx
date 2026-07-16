// 첨부자료

"use client";

import { useEffect, useState } from "react";
import { ApiRequestError } from "@/lib/api";
import { getCourseStudyDetail } from "@/features/services/courseStudy.service";
import { getMe } from "@/features/services/user.service";
import type { CourseFile } from "./types";

interface LectureAttachmentsProps {
  courseId: string;
  fileUrls: string[];
  files?: CourseFile[];
}

const getFileName = (url: string, index: number) => {
  try {
    const parsedUrl = new URL(url);
    const pathname = decodeURIComponent(parsedUrl.pathname);
    const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);

    return fileName || `첨부 파일 ${index + 1}`;
  } catch {
    const fileName = decodeURIComponent(url.substring(url.lastIndexOf("/") + 1));

    return fileName || `첨부 파일 ${index + 1}`;
  }
};

export default function LectureAttachments({
  courseId,
  fileUrls,
  files,
}: LectureAttachmentsProps) {
  // files(원본 파일명 포함)가 있으면 우선 사용하고, 없으면 URL 목록으로 대체합니다.
  const attachments =
    files && files.length > 0
      ? [...files]
          .sort((a, b) => a.fileOrder - b.fileOrder)
          .map((file, index) => ({
            url: file.fileUrl,
            name: file.originalFileName || getFileName(file.fileUrl, index),
          }))
      : fileUrls.map((url, index) => ({ url, name: getFileName(url, index) }));
  const hasAttachments = attachments.length > 0;
  const [canViewAttachments, setCanViewAttachments] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    let isActive = true;

    const checkAttachmentAccess = async () => {
      if (!courseId || !hasAttachments) {
        setCanViewAttachments(false);
        setIsCheckingAccess(false);
        return;
      }

      try {
        setIsCheckingAccess(true);

        const user = await getMe();

        if (!isActive) return;

        if (!user) {
          setCanViewAttachments(false);
          return;
        }

        await getCourseStudyDetail(courseId);

        if (!isActive) return;

        setCanViewAttachments(true);
      } catch (error) {
        if (!isActive) return;

        if (error instanceof ApiRequestError) {
          if (error.status === 401 || error.status === 403 || error.status === 404) {
            setCanViewAttachments(false);
            return;
          }
        }

        console.error("[lecture-attachments] 첨부자료 권한 확인 실패:", error);
        setCanViewAttachments(false);
      } finally {
        if (isActive) {
          setIsCheckingAccess(false);
        }
      }
    };

    void checkAttachmentAccess();

    return () => {
      isActive = false;
    };
  }, [courseId, hasAttachments]);

  if (attachments.length === 0) {
    return null;
  }

  if (isCheckingAccess) {
    return null;
  }

  if (!canViewAttachments) {
    return null;
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#0A1628]">
          <img src="/images/download.svg" alt="" aria-hidden="true" />
          첨부 자료
        </h2>
      </div>

      <div>
        {attachments.map(({ url, name }, index) => {
          return (
            <div
              key={`${url}-${index}`}
              className="mb-3 flex items-center justify-between rounded-xl border border-gray-100 bg-[#F5F7FA] p-4"
            >
              <span className="min-w-0 truncate text-sm font-medium text-[#0A1628]">
                {name}
              </span>

              <a
                href={url}
                download
                target="_blank"
                rel="noreferrer"
                className="ml-4 shrink-0 text-xs font-semibold text-[#439A97] hover:underline"
              >
                다운 받기
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}