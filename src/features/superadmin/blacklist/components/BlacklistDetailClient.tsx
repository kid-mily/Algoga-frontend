"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import {
  getBlacklistCandidateById,
  getReportedUserReports,
  registerBlacklistUser,
} from "@/features/services/adminBlacklist.service";
import { getErrorMessage } from "@/features/services/error.service";
import { BlacklistUserDetail, PageResult, ReportHistory } from "../types";
import BlacklistPagination from "./BlacklistPagination";
import { ReportStatusBadge } from "./BlacklistStatusBadge";

const REPORT_PAGE_SIZE = 5;

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
  const [completeOpen, setCompleteOpen] = useState(false);

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

    try {
      setIsProcessing(true);
      setUserError("");
      setReportError("");
      await registerBlacklistUser(userId);
      setConfirmOpen(false);
      setCompleteOpen(true);
    } catch (actionError: unknown) {
      setUserError(getErrorMessage(actionError, "블랙리스트 등록에 실패했습니다."));
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
                <UserInfoItem icon="/images/user.svg" label="회원 ID" value={user.displayId} />
                <UserInfoItem icon="/images/user.svg" label="이름" value={user.name} />
                <UserInfoItem icon="/images/user.svg" label="닉네임" value={user.nickname} />
                <UserInfoItem icon="/images/mail.svg" label="이메일" value={user.email} />
                <UserInfoItem icon="/images/calendar.svg" label="가입일" value={user.joinedAt} />
                <UserInfoItem icon="/images/warning.svg" label="신고 횟수" value={`${user.reportCount}회`} danger />
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
                      <td className="px-5 py-5">{report.targetType}</td>
                      <td className="px-5 py-5">{report.reasonType}</td>
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
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="mb-6 flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#D92D20] text-[14px] font-bold text-white"
            >
              <span className="text-[18px]">⊘</span>
              블랙리스트 등록
            </button>
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

      <Modal
        open={confirmOpen}
        title="블랙리스트 등록"
        description={`${user?.name || displayUserId} 유저를 블랙리스트로 등록하시겠습니까?`}
        confirmText={isProcessing ? "처리 중..." : "등록"}
        cancelText="취소"
        confirmDisabled={isProcessing}
        onConfirm={handleRegister}
        onCancel={() => setConfirmOpen(false)}
      />
      <CompleteModal
        open={completeOpen}
        title="등록 완료"
        description="블랙리스트 등록이 완료되었습니다."
        buttonText="확인"
        onConfirm={() => router.push("/superadmin/blacklist")}
      />
    </main>
  );
}

function UserInfoItem({
  icon,
  label,
  value,
  danger = false,
}: {
  icon: string;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Image src={icon} alt="" aria-hidden width={18} height={18} className="mt-1" />
      <div>
        <p className="mb-1 text-[13px] font-semibold text-[#98A2B3]">{label}</p>
        <p className={`text-[14px] font-bold ${danger ? "text-[#DC2626]" : "text-[#111827]"}`}>
          {value}
        </p>
      </div>
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
