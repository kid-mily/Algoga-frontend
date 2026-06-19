"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import CompleteModal from "@/features/common/CompleteModal";
import Modal from "@/features/common/Modal";
import SimpleSubHeader from "@/features/common/SimpleSubHeader";
import {
  deregisterBlacklistUser,
  getBlacklistCandidates,
  getBlacklistedUsers,
  registerBlacklistUser,
} from "@/features/services/adminBlacklist.service";
import { getErrorMessage } from "@/features/services/error.service";
import { BlacklistTab, BlacklistUser, PageResult } from "../types";
import BlacklistPagination from "./BlacklistPagination";
import { BlacklistedTable, CandidateTable } from "./BlacklistTables";

const PAGE_SIZE = 10;

const emptyPage = <T,>(): PageResult<T> => ({
  items: [],
  page: 1,
  size: PAGE_SIZE,
  totalElements: 0,
  totalPages: 1,
});

export default function BlacklistManageClient() {
  const [activeTab, setActiveTab] = useState<BlacklistTab>("candidates");
  const [candidatePage, setCandidatePage] = useState(1);
  const [blacklistPage, setBlacklistPage] = useState(1);
  const [candidateData, setCandidateData] = useState<PageResult<BlacklistUser>>(emptyPage);
  const [blacklistData, setBlacklistData] = useState<PageResult<BlacklistUser>>(emptyPage);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [completeMessage, setCompleteMessage] = useState("");
  const [registerTarget, setRegisterTarget] = useState<BlacklistUser | null>(null);
  const [deregisterTarget, setDeregisterTarget] = useState<BlacklistUser | null>(null);

  const loadCandidates = useCallback(async (index: number, signal?: AbortSignal) => {
    const data = await getBlacklistCandidates({ index, size: PAGE_SIZE, signal });

    if (signal?.aborted) return;
    setCandidateData(data);
  }, []);

  const loadBlacklists = useCallback(async (index: number, signal?: AbortSignal) => {
    const data = await getBlacklistedUsers({ index, size: PAGE_SIZE, signal });

    if (signal?.aborted) return;
    setBlacklistData(data);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        if (activeTab === "candidates") {
          await loadCandidates(candidatePage, controller.signal);
        } else {
          await loadBlacklists(blacklistPage, controller.signal);
        }
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(loadError, "블랙리스트 정보를 불러오지 못했습니다."));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [activeTab, blacklistPage, candidatePage, loadBlacklists, loadCandidates]);

  const visibleCandidates = useMemo(
    () => filterUsers(candidateData.items, searchKeyword),
    [candidateData.items, searchKeyword]
  );
  const visibleBlacklists = useMemo(
    () => filterUsers(blacklistData.items, searchKeyword),
    [blacklistData.items, searchKeyword]
  );

  const handleRegister = async () => {
    if (!registerTarget || isProcessing) return;

    const targetUserId = registerTarget.userId;

    try {
      setIsProcessing(true);
      setError("");
      await registerBlacklistUser(targetUserId);
    } catch (actionError: unknown) {
      setError(getErrorMessage(actionError, "블랙리스트 등록에 실패했습니다."));
      setIsProcessing(false);
      return;
    }

    setRegisterTarget(null);
    setCompleteMessage("블랙리스트 등록이 완료되었습니다.");

    try {
      await Promise.all([
        loadCandidates(candidatePage),
        loadBlacklists(blacklistPage),
      ]);
    } catch (reloadError: unknown) {
      setError(getErrorMessage(reloadError, "등록은 완료됐지만 목록을 새로고침하지 못했습니다."));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeregister = async () => {
    if (!deregisterTarget || isProcessing) return;

    try {
      setIsProcessing(true);
      setError("");
      await deregisterBlacklistUser(deregisterTarget.userId);
      await loadBlacklists(blacklistPage);
      setDeregisterTarget(null);
      setCompleteMessage("블랙리스트 해제가 완료되었습니다.");
    } catch (actionError: unknown) {
      setError(getErrorMessage(actionError, "블랙리스트 해제에 실패했습니다."));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main aria-labelledby="blacklist-management-title">
      <SimpleSubHeader
        title="블랙리스트 관리"
        description="신고 누적 유저와 블랙리스트 등록 유저를 관리합니다"
      />
      <h1 id="blacklist-management-title" className="sr-only">
        블랙리스트 관리
      </h1>

      <AdminErrorBanner message={error} className="mt-4" />

      <section className="mt-6 overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
        <div className="flex border-b border-[#E4E7EC]">
          <TabButton
            active={activeTab === "candidates"}
            onClick={() => setActiveTab("candidates")}
          >
            블랙리스트 후보 ({candidateData.totalElements})
          </TabButton>
          <TabButton
            active={activeTab === "blacklist"}
            onClick={() => setActiveTab("blacklist")}
          >
            블랙리스트 목록 ({blacklistData.totalElements})
          </TabButton>
        </div>

        <div className="border-b border-[#EEF0F3] p-4">
          <label className="flex h-[42px] items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
            <span className="sr-only">블랙리스트 유저 검색</span>
            <Image src="/images/search.svg" alt="" aria-hidden width={17} height={17} />
            <input
              type="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="이름, 닉네임, 이메일, 회원 ID 검색"
              className="w-full text-[14px] outline-none placeholder:text-[#98A2B3]"
            />
          </label>
        </div>

        {activeTab === "candidates" ? (
          <>
            <CandidateTable
              users={visibleCandidates}
              isLoading={isLoading}
              onRegister={setRegisterTarget}
            />
            <BlacklistPagination
              currentPage={candidateData.page}
              totalPages={candidateData.totalPages}
              onPageChange={setCandidatePage}
            />
          </>
        ) : (
          <>
            <BlacklistedTable
              users={visibleBlacklists}
              isLoading={isLoading}
              onDeregister={setDeregisterTarget}
            />
            <BlacklistPagination
              currentPage={blacklistData.page}
              totalPages={blacklistData.totalPages}
              onPageChange={setBlacklistPage}
            />
          </>
        )}
      </section>

      <Modal
        open={Boolean(registerTarget)}
        title="블랙리스트 등록"
        description={`${registerTarget?.name || "선택한 유저"}를 블랙리스트로 등록하시겠습니까?`}
        confirmText={isProcessing ? "처리 중..." : "등록"}
        cancelText="취소"
        confirmDisabled={isProcessing}
        onConfirm={handleRegister}
        onCancel={() => setRegisterTarget(null)}
      />

      <Modal
        open={Boolean(deregisterTarget)}
        title="블랙리스트 해제"
        description={`${deregisterTarget?.name || "선택한 유저"}의 블랙리스트를 해제하시겠습니까?`}
        confirmText={isProcessing ? "처리 중..." : "해제"}
        cancelText="취소"
        confirmDisabled={isProcessing}
        onConfirm={handleDeregister}
        onCancel={() => setDeregisterTarget(null)}
      />

      <CompleteModal
        open={Boolean(completeMessage)}
        title="처리 완료"
        description={completeMessage}
        buttonText="확인"
        onConfirm={() => setCompleteMessage("")}
      />
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[52px] px-6 text-[14px] font-bold ${
        active
          ? "border-b-2 border-[#639E9B] text-[#439A97]"
          : "text-[#667085]"
      }`}
    >
      {children}
    </button>
  );
}

const filterUsers = (users: BlacklistUser[], keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) return users;

  return users.filter((user) =>
    [
      user.displayId,
      user.name,
      user.nickname,
      user.email,
      String(user.userId),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedKeyword)
  );
};
