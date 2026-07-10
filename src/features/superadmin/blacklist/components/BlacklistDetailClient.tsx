"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import CompleteModal from "@/features/common/components/CompleteModal";
import Modal from "@/features/common/components/Modal";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import {
  deregisterBlacklistUser,
  getBlacklistCandidateById,
  getReportedUserReports,
  registerBlacklistUser,
} from "@/features/services/adminBlacklist.service";
import { getErrorMessage } from "@/features/services/error.service";
import { BlacklistUserDetail, PageResult, ReportHistory } from "../types";
import BlacklistPagination from "./BlacklistPagination";
import { ReportStatusBadge } from "./BlacklistStatusBadge";

const REPORT_PAGE_SIZE = 5;

const reportTargetLabel: Record<string, string> = {
  POST: "게시글",
  COMMENT: "댓글",
  USER: "사용자",
  UNKNOWN: "-",
};

const reportReasonLabel: Record<string, string> = {
  SPAM: "스팸/광고",
  ABUSE: "욕설/비방",
  FALSE_INFO: "허위정보",
  INAPPROPRIATE: "부적절한 콘텐츠",
  COPYRIGHT: "저작권 침해",
  ETC: "기타",
};

const getReportReasonLabel = (reasonType: string) => {
  return reportReasonLabel[reasonType] ?? reasonType;
};

export default function BlacklistDetailClient({ userId }: { userId: number }) {
  const router = useRouter();
  const [user, setUser] = useState<BlacklistUserDetail | null>(null);
  const [reports, setReports] = useState<PageResult<ReportHistory>>({
    items: [],
    page: 1,
    size: REPORT_PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
  });
  const [reportPage, setReportPage] = useState(1);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isReportLoading, setIsReportLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userError, setUserError] = useState("");
  const [reportError, setReportError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deregisterConfirmOpen, setDeregisterConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [completeMessage, setCompleteMessage] = useState("");
  const [registerReason, setRegisterReason] = useState("");
  const [registerReasonError, setRegisterReasonError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsUserLoading(true);
        setUserError("");
        const userData = await getBlacklistCandidateById(userId, controller.signal);

        if (controller.signal.aborted) return;
        setUser(userData);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;
        setUserError(getErrorMessage(loadError, "유저 상세 정보를 불러오지 못했습니다."));
      } finally {
        if (!controller.signal.aborted) {
          setIsUserLoading(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [userId]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsReportLoading(true);
        setReportError("");
        const reportData = await getReportedUserReports({
          userId,
          index: reportPage,
          size: REPORT_PAGE_SIZE,
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;
        setReports(reportData);
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;
        setReportError(getErrorMessage(loadError, "신고 이력을 불러오지 못했습니다."));
      } finally {
        if (!controller.signal.aborted) {
          setIsReportLoading(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [reportPage, userId]);

  const handleRegister = async () => {
    if (isProcessing) return;

    const nextReason = registerReason.trim();

    if (!nextReason) {
      setRegisterReasonError("등록 사유를 입력해주세요.");
      return;
    }

    try {
      setIsProcessing(true);
      setUserError("");
      setReportError("");
      await registerBlacklistUser(userId, nextReason);
      setConfirmOpen(false);
      setRegisterReason("");
      setRegisterReasonError("");
      setCompleteMessage("블랙리스트 등록이 완료되었습니다.");
      setCompleteOpen(true);
    } catch (actionError: unknown) {
      setUserError(getErrorMessage(actionError, "블랙리스트 등록에 실패했습니다."));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseConfirmModal = () => {
    if (isProcessing) return;

    setConfirmOpen(false);
    setRegisterReason("");
    setRegisterReasonError("");
  };

  const handleDeregister = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setUserError("");
      setReportError("");
      await deregisterBlacklistUser(userId);
      setDeregisterConfirmOpen(false);
      setCompleteMessage("블랙리스트 해제가 완료되었습니다.");
      setCompleteOpen(true);
    } catch (actionError: unknown) {
      setUserError(getErrorMessage(actionError, "블랙리스트 해제에 실패했습니다."));
    } finally {
      setIsProcessing(false);
    }
  };

  const displayUserId = user?.displayId ?? `U${String(userId).padStart(4, "0")}`;

  return (
    <main aria-labelledby="blacklist-detail-title">
      <div className="mb-6 flex items-start gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-1 text-[22px] text-[#344054]"
          aria-label="이전 화면으로 돌아가기"
        >
          ←
        </button>
        <SimpleSubHeader title="유저 상세 정보" description={`회원 ID: ${displayUserId}`} />
        <h1 id="blacklist-detail-title" className="sr-only">
          블랙리스트 후보 유저 상세 정보
        </h1>
      </div>

      <AdminErrorBanner message={userError || reportError} className="mb-4" />

      <div className="grid grid-cols-[1fr_360px] gap-6">
        <section className="space-y-6">
          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-6">
            <h2 className="mb-6 text-[20px] font-bold text-[#111827]">유저 정보</h2>
            {isUserLoading ? (
              <p className="text-[14px] text-[#667085]">유저 정보를 불러오는 중입니다...</p>
            ) : user ? (
              <div className="grid grid-cols-2 gap-x-16 gap-y-7">
                <UserInfoItem label="유저 ID" value={String(user.userId)} />
                <UserInfoItem label="아이디" value={user.username} />
                <UserInfoItem label="이름" value={user.name} />
                <UserInfoItem label="닉네임" value={user.nickname} />
                <UserInfoItem label="이메일" value={user.email} />
                <UserInfoItem label="신고 횟수" value={`${user.reportCount}회`} danger />
                <UserInfoItem label="최근 신고일" value={user.lastReportedAt} />
                <UserInfoItem
                  label="블랙리스트 여부"
                  value={user.isBlacklisted ? "등록됨" : "미등록"}
                  danger={user.isBlacklisted}
                />
              </div>
            ) : (
              <p className="text-[14px] text-[#667085]">유저 정보를 찾을 수 없습니다.</p>
            )}
          </section>

          <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
            <h2 className="px-6 py-5 text-[20px] font-bold text-[#111827]">신고 이력</h2>
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-y border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-bold text-[#344054]">
                  <th className="w-[120px] px-5 py-4">신고 ID</th>
                  <th className="w-[130px] px-5 py-4">신고 유형</th>
                  <th className="px-5 py-4">신고 사유</th>
                  <th className="w-[140px] px-5 py-4">신고일</th>
                  <th className="w-[140px] px-5 py-4">처리 결과</th>
                </tr>
              </thead>
              <tbody>
                {isReportLoading ? (
                  <ReportEmptyRow text="신고 이력을 불러오는 중입니다." />
                ) : reports.items.length === 0 ? (
                  <ReportEmptyRow text="신고 이력이 없습니다." />
                ) : (
                  reports.items.map((report) => (
                    <tr key={report.reportId} className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
                      <td className="px-5 py-5 font-semibold">{report.displayId}</td>
                      <td className="px-5 py-5">
                        {reportTargetLabel[report.targetType]}
                      </td>
                      <td className="px-5 py-5">
                        {getReportReasonLabel(report.reasonType)}
                      </td>
                      <td className="px-5 py-5 text-[#667085]">{report.createdAt}</td>
                      <td className="px-5 py-5"><ReportStatusBadge status={report.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <BlacklistPagination
              currentPage={reports.page}
              totalPages={reports.totalPages}
              onPageChange={setReportPage}
            />
          </section>
        </section>

        <aside>
          <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-6">
            <h2 className="mb-5 text-[20px] font-bold text-[#111827]">관리 액션</h2>
            {user?.isBlacklisted ? (
              <button
                type="button"
                onClick={() => setDeregisterConfirmOpen(true)}
                className="mb-6 flex h-[48px] w-full items-center justify-center rounded-[10px] border border-[#D0D5DD] text-[14px] font-bold text-[#344054]"
              >
                블랙리스트 해제
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="mb-6 flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#D92D20] text-[14px] font-bold text-white"
              >
                <span className="text-[18px]">⊘</span>
                블랙리스트 등록
              </button>
            )}
            <div className="rounded-[10px] bg-[#F9FAFB] p-4">
              <p className="mb-3 text-[13px] font-bold text-[#667085]">블랙리스트 등록 시</p>
              <ul className="space-y-1 text-[13px] font-semibold leading-[1.7] text-[#344054]">
                <li>· 계정 상태 변경</li>
                <li>· 로그인 차단</li>
                <li>· 블랙리스트 등록</li>
                <li>· 처리 이력 기록</li>
              </ul>
            </div>
          </section>
        </aside>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="blacklist-register-modal-title"
            className="w-full max-w-[460px] rounded-[20px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
          >
            <h2
              id="blacklist-register-modal-title"
              className="text-[20px] font-bold text-[#111827]"
            >
              블랙리스트 등록
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-[#667085]">
              {user?.name || displayUserId} 유저를 블랙리스트로 등록하시겠습니까?
            </p>

            <label className="mt-5 block">
              <span className="text-[14px] font-bold text-[#344054]">
                등록 사유
              </span>
              <textarea
                value={registerReason}
                onChange={(event) => {
                  setRegisterReason(event.target.value);
                  setRegisterReasonError("");
                }}
                disabled={isProcessing}
                placeholder="블랙리스트 등록 사유를 입력해주세요."
                className={`mt-2 h-[120px] w-full resize-none rounded-[14px] border p-4 text-[14px] outline-none disabled:bg-[#F2F4F7] ${
                  registerReasonError
                    ? "border-[#DC2626] bg-[#FEF2F2]"
                    : "border-[#D0D5DD] focus:border-[#439A97]"
                }`}
              />
            </label>
            {registerReasonError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {registerReasonError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleCloseConfirmModal}
                disabled={isProcessing}
                className="h-[42px] flex-1 rounded-[12px] border border-[#D0D5DD] text-[15px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleRegister}
                disabled={isProcessing}
                className="h-[42px] flex-1 rounded-[12px] bg-[#D92D20] text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
              >
                {isProcessing ? "처리 중..." : "등록"}
              </button>
            </div>
          </section>
        </div>
      )}
      <Modal
        open={deregisterConfirmOpen}
        title="블랙리스트 해제"
        description={`${user?.name || displayUserId} 유저의 블랙리스트를 해제하시겠습니까?`}
        confirmText={isProcessing ? "처리 중..." : "해제"}
        cancelText="취소"
        confirmDisabled={isProcessing}
        onConfirm={handleDeregister}
        onCancel={() => setDeregisterConfirmOpen(false)}
      />
      <CompleteModal
        open={completeOpen}
        title="처리 완료"
        description={completeMessage}
        buttonText="확인"
        onConfirm={() => router.push("/superadmin/blacklist")}
      />
    </main>
  );
}

function UserInfoItem({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-[13px] font-semibold text-[#98A2B3]">{label}</p>
      <p className={`text-[14px] font-bold ${danger ? "text-[#DC2626]" : "text-[#111827]"}`}>
        {value}
      </p>
    </div>
  );
}

function ReportEmptyRow({ text }: { text: string }) {
  return (
    <tr>
      <td colSpan={5} role="status" aria-live="polite" className="px-5 py-12 text-center text-[14px] text-[#667085]">
        {text}
      </td>
    </tr>
  );
}
