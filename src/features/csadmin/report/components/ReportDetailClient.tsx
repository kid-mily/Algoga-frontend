"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import SubHeader from "@/features/common/components/SubHeader";
import {
  completeAdminReport,
  deleteReportedTarget,
  getAdminReportById,
  rejectAdminReport,
} from "@/features/services/adminReport.service";
import {
  AdminReport,
  reportStatusLabel,
  reportTargetTypeLabel,
} from "@/features/csadmin/report/types";
import { formatReportError } from "@/features/csadmin/report/utils";
import ReportStatusBadge from "./ReportStatusBadge";

type ReportAction = "delete-target" | "reject" | "complete";

type ReportDetailClientProps = {
  reportId: number;
};

const actionLabel: Record<ReportAction, string> = {
  "delete-target": "대상 삭제",
  reject: "신고 반려",
  complete: "처리 완료",
};

export default function ReportDetailClient({ reportId }: ReportDetailClientProps) {
  const router = useRouter();
  const [report, setReport] = useState<AdminReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState<ReportAction | null>(null);
  const [completeMessage, setCompleteMessage] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    void Promise.resolve().then(() => {
      if (controller.signal.aborted) return;
      setIsLoading(true);

      getAdminReportById(reportId, controller.signal)
        .then((data) => {
          if (controller.signal.aborted) return;
          setError("");
          setReport(data);
        })
        .catch((fetchError: unknown) => {
          if (controller.signal.aborted) return;
          setError(formatReportError(fetchError, "신고 상세 정보를 불러오지 못했습니다."));
          setReport(null);
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    });

    return () => {
      controller.abort();
    };
  }, [reportId]);

  const handleConfirmAction = async () => {
    if (isSubmitting) return;
    if (!report || !confirmAction) return;

    try {
      setIsSubmitting(true);
      setError("");

      if (confirmAction === "delete-target") {
        await deleteReportedTarget(report.targetType, report.targetId);
        setCompleteMessage(`${reportTargetTypeLabel[report.targetType]}이 삭제되었습니다.`);
      }

      if (confirmAction === "reject") {
        await rejectAdminReport(report.reportId);
        setCompleteMessage("신고가 반려되었습니다.");
      }

      if (confirmAction === "complete") {
        await completeAdminReport(report.reportId);
        setCompleteMessage("신고가 처리 완료되었습니다.");
      }

      setConfirmAction(null);
      const updatedReport = await getAdminReportById(report.reportId);
      setReport(updatedReport);
    } catch (actionError: unknown) {
      setError(formatReportError(actionError, "신고 처리에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        신고 상세 정보를 불러오는 중입니다...
      </section>
    );
  }

  if (!report) {
    return (
      <AdminErrorBanner
        message={error || "신고 상세 정보를 찾을 수 없습니다."}
        className="m-0"
      />
    );
  }

  const targetDeleteLabel =
    report.targetType === "COMMENT" ? "댓글 삭제" : "게시글 삭제";
  const isReceived = report.status === "RECEIVED";

  return (
    <main aria-labelledby="report-detail-title">
      <SubHeader
        backHref="/csadmin/reports"
        backText="신고 내역 목록으로 돌아가기"
        title="신고 내역 상세 조회"
        description={`신고 ID #${report.reportId} | 접수일 ${report.createdAt}`}
      />
      <span id="report-detail-title" className="sr-only">
        신고 내역 상세 조회
      </span>

      <AdminErrorBanner message={error} className="mb-4" />

      <section className="rounded-[16px] border border-[#E4E7EC] bg-white">
        <header className="flex items-center justify-between gap-4 border-b border-[#E4E7EC] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#111827]">신고 내용</h2>
            <p className="mt-1 text-[13px] text-[#667085]">
              신고 대상 삭제와 신고 상태 처리를 진행합니다.
            </p>
          </div>
          <ReportStatusBadge status={report.status} />
        </header>

        <dl className="grid grid-cols-2 gap-4 p-6 text-[14px]">
          <Info label="신고자" value={`${report.reporterName} (#${report.reporterId})`} />
          <Info
            label="피신고자"
            value={`${report.reportedUserName} ${
              report.reportedUserId > 0 ? `(#${report.reportedUserId})` : ""
            }`}
          />
          <Info label="대상 유형" value={reportTargetTypeLabel[report.targetType]} />
          <Info label="대상 ID" value={String(report.targetId)} />
          <Info label="처리 상태" value={reportStatusLabel[report.status]} />
          <Info label="게시글 제목" value={report.postTitle} wide />
          <Info label="신고 사유" value={report.reason} wide />
          <Info label="대상 내용" value={report.content} wide preserve />
        </dl>

        <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E4E7EC] px-6 py-4">
          <button
            type="button"
            disabled={isSubmitting || report.status === "COMPLETED"}
            onClick={() => setConfirmAction("delete-target")}
            className="h-[34px] rounded-[8px] bg-[#DC2626] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            {targetDeleteLabel}
          </button>
          <button
            type="button"
            disabled={isSubmitting || !isReceived}
            onClick={() => setConfirmAction("reject")}
            className="h-[34px] rounded-[8px] border border-[#D0D5DD] px-4 text-[13px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:text-[#98A2B3]"
          >
            신고 반려
          </button>
          <button
            type="button"
            disabled={isSubmitting || report.status === "COMPLETED"}
            onClick={() => setConfirmAction("complete")}
            className="h-[34px] rounded-[8px] bg-[#639E9B] px-4 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            신고 처리완료
          </button>
        </footer>
      </section>

      <Modal
        open={Boolean(confirmAction)}
        title={confirmAction ? actionLabel[confirmAction] : "신고 처리"}
        description={`${confirmAction ? actionLabel[confirmAction] : "선택한 작업"}을 진행하시겠습니까?`}
        confirmText="확인"
        cancelText="취소"
        confirmDisabled={isSubmitting}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />

      <CompleteModal
        open={Boolean(completeMessage)}
        title="처리 완료"
        description={completeMessage}
        buttonText="확인"
        onConfirm={() => {
          setCompleteMessage("");
          router.refresh();
        }}
      />
    </main>
  );
}

function Info({
  label,
  value,
  wide = false,
  preserve = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
  preserve?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <dt className="text-[13px] font-semibold text-[#667085]">{label}</dt>
      <dd
        className={`mt-2 rounded-[10px] bg-[#F9FAFB] px-4 py-3 text-[#111827] ${
          preserve ? "whitespace-pre-wrap" : ""
        }`}
      >
        {value || "-"}
      </dd>
    </div>
  );
}
