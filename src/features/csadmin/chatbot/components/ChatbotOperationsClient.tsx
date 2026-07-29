"use client";

import { useState } from "react";
import { Download, Eye, FileText, Search, X } from "lucide-react";
import SimpleSubHeader from "@/features/common/components/SimpleSubHeader";
import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import {
  downloadChatLogsCsv,
  downloadRagSourceStatsCsv,
} from "@/features/services/adminChatbot.service";
import { useAdminChatLogs, ChatLogStatusFilter } from "../hooks/useAdminChatLogs";
import { useAdminRagSourceStats } from "../hooks/useAdminRagSourceStats";
import { AdminChatLog } from "../types";

const statusOptions: { value: ChatLogStatusFilter; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "NORMAL", label: "정상 답변" },
  { value: "BLOCKED", label: "차단된 질문" },
];

const getAuthorName = (log: AdminChatLog) =>
  log.userNickname ?? log.userName ?? "(알 수 없음)";

const formatLogDateTime = (iso: string) => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return { date: iso, time: "" };

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");

  return { date: `${yyyy}.${mm}.${dd}`, time: `${hh}:${mi}` };
};

export default function ChatbotOperationsClient() {
  const [activeTab, setActiveTab] = useState<"logs" | "rag">("logs");
  const [selectedLog, setSelectedLog] = useState<AdminChatLog | null>(null);

  return (
    <main aria-labelledby="chatbot-management-title" className="min-w-0">
      <SimpleSubHeader
        title="챗봇 운영 관리"
        description="챗봇 대화 내역과 답변 근거 문서의 활용 현황을 확인합니다."
      />
      <h1 id="chatbot-management-title" className="sr-only">챗봇 운영 관리</h1>

      <div className="mt-6 flex border-b border-[#E4E7EC]">
        <TabButton active={activeTab === "logs"} onClick={() => setActiveTab("logs")}>대화 로그</TabButton>
        <TabButton active={activeTab === "rag"} onClick={() => setActiveTab("rag")}>RAG 채택 분석</TabButton>
      </div>

      {activeTab === "logs" ? (
        <ChatLogsPanel onSelectLog={setSelectedLog} />
      ) : (
        <RagAnalyticsPanel />
      )}

      {selectedLog && <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </main>
  );
}

function ChatLogsPanel({ onSelectLog }: { onSelectLog: (log: AdminChatLog) => void }) {
  const logs = useAdminChatLogs();
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [csvError, setCsvError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleReset = () => {
    setKeyword("");
    setStartDate("");
    setEndDate("");
    logs.reset();
  };

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setCsvError("");
      await downloadChatLogsCsv({
        filtered:
          logs.status === "NORMAL"
            ? false
            : logs.status === "BLOCKED"
              ? true
              : undefined,
        from: logs.appliedFrom,
        to: logs.appliedTo,
        keyword: logs.appliedKeyword,
      });
    } catch {
      setCsvError("CSV 다운로드에 실패했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  const { content, page, totalPages, totalElements, first, last } = logs.data;

  return (
    <>
      <AdminErrorBanner message={logs.error || csvError} className="mt-4" />

      <section aria-label="대화 로그 검색 조건" className="mt-5 rounded-[16px] border border-[#E7EAF0] bg-white px-6 py-5 shadow-[0_3px_12px_rgba(16,24,40,0.05)]">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-[#475467]">답변 상태</span>
            <div className="flex overflow-hidden rounded-[10px] border border-[#DDE2E8]">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => logs.setStatus(option.value)}
                  className={`h-9 border-r border-[#DDE2E8] px-4 text-[12px] font-semibold last:border-r-0 ${logs.status === option.value ? "bg-[#439A97] text-white" : "bg-white text-[#667085]"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="chatbot-start-date" className="text-[13px] font-semibold text-[#475467]">기간</label>
            <input id="chatbot-start-date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="h-9 w-[140px] rounded-[10px] border border-[#DDE2E8] px-3 text-[12px] text-[#667085] outline-none focus:border-[#439A97]" />
            <span className="text-[#98A2B3]">~</span>
            <input aria-label="종료일" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="h-9 w-[140px] rounded-[10px] border border-[#DDE2E8] px-3 text-[12px] text-[#667085] outline-none focus:border-[#439A97]" />
          </div>
        </div>

        <form onSubmit={(event) => { event.preventDefault(); logs.applySearch({ from: startDate, to: endDate, keyword }); }} className="mt-4 flex flex-wrap items-center gap-2">
          <label htmlFor="chatbot-log-search" className="flex h-10 w-full max-w-[470px] items-center rounded-[12px] border border-[#DDE2E8] px-3 focus-within:border-[#439A97]">
            <Search size={16} className="shrink-0 text-[#98A2B3]" />
            <span className="sr-only">질문 또는 답변 검색</span>
            <input id="chatbot-log-search" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="질문 또는 답변 내용을 검색해 주세요." className="ml-2 w-full bg-transparent text-[13px] text-[#344054] outline-none placeholder:text-[#98A2B3]" />
          </label>
          <button type="submit" className="h-10 rounded-[11px] bg-[#439A97] px-5 text-[13px] font-semibold text-white">조회</button>
          <button type="button" onClick={handleReset} className="h-10 rounded-[11px] border border-[#DDE2E8] bg-white px-5 text-[13px] font-semibold text-[#667085]">초기화</button>
        </form>
      </section>

      <section className="mt-5 overflow-hidden rounded-[16px] border border-[#E7EAF0] bg-white shadow-[0_3px_12px_rgba(16,24,40,0.05)]">
        <header className="flex items-center justify-between border-b border-[#E7EAF0] px-6 py-5">
          <h2 className="text-[15px] font-bold text-[#111827]">대화 로그</h2>
          <div className="flex items-center gap-3">
            <p className="text-[12px] text-[#98A2B3]">총 {totalElements}건 · 페이지당 20건</p>
            <button type="button" onClick={handleDownload} disabled={isDownloading} className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-[#DDE2E8] px-3 text-[12px] font-semibold text-[#475467] disabled:cursor-not-allowed disabled:opacity-60">
              <Download size={14} />
              {isDownloading ? "다운로드 중..." : "CSV 다운로드"}
            </button>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] table-fixed border-collapse text-left">
            <thead className="bg-[#F8FAFC] text-[12px] font-semibold text-[#667085]">
              <tr>
                <th className="w-[70px] px-5 py-4">번호</th>
                <th className="w-[180px] px-5 py-4">작성자</th>
                <th className="w-[25%] px-5 py-4">질문</th>
                <th className="w-[30%] px-5 py-4">답변</th>
                <th className="w-[110px] px-5 py-4">처리 유형</th>
                <th className="w-[130px] px-5 py-4">작성 시간</th>
                <th className="w-[70px] px-5 py-4 text-center">상세</th>
              </tr>
            </thead>
            <tbody>
              {logs.isLoading ? (
                <tr><td colSpan={7} className="px-6 py-20 text-center text-[14px] text-[#98A2B3]">대화 로그를 불러오는 중입니다...</td></tr>
              ) : content.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-20 text-center text-[14px] text-[#98A2B3]">조건에 맞는 대화 로그가 없습니다.</td></tr>
              ) : content.map((log) => {
                const { date, time } = formatLogDateTime(log.createdAt);

                return (
                  <tr key={log.chatLogId} className="border-t border-[#EEF0F3] text-[13px] text-[#344054]">
                    <td className="px-5 py-4 text-[#98A2B3]">{log.chatLogId}</td>
                    <td className="px-5 py-4"><p className="font-semibold text-[#111827]">{getAuthorName(log)}</p><p className="mt-1 text-[11px] text-[#98A2B3]">회원 #{log.userId}</p></td>
                    <td className="px-5 py-4"><p className="truncate">{log.question}</p></td>
                    <td className="px-5 py-4"><p className="line-clamp-2 leading-5 text-[#667085]">{log.answer}</p></td>
                    <td className="px-5 py-4"><StatusBadge filtered={log.filtered} /></td>
                    <td className="px-5 py-4 text-[12px] text-[#667085]"><p>{date}</p><p className="mt-1 text-[#98A2B3]">{time}</p></td>
                    <td className="px-5 py-4 text-center"><button type="button" onClick={() => onSelectLog(log)} aria-label={`${log.chatLogId}번 대화 상세 보기`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#667085] hover:bg-[#F2F4F7] hover:text-[#439A97]"><Eye size={17} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PageNav page={page} totalPages={totalPages} first={first} last={last} onChange={logs.setPage} />
      </section>
    </>
  );
}

function RagAnalyticsPanel() {
  const rag = useAdminRagSourceStats();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [csvError, setCsvError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    rag.reset();
  };

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setCsvError("");
      await downloadRagSourceStatsCsv({ from: rag.from, to: rag.to });
    } catch {
      setCsvError("CSV 다운로드에 실패했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  const { content, page, size, totalPages, totalElements, first, last } = rag.data;
  // 페이지 내 최대 채택 횟수 기준으로 막대 길이를 정규화한다(count 내림차순이라 첫 항목이 최대).
  const maxCount = content[0]?.count ?? 0;
  // TOP 10 차트: 첫 페이지 상위 데이터, 상위 count 기준 정규화.
  const topStats = rag.topStats;
  const topMaxCount = topStats[0]?.count ?? 0;

  return (
    <div className="mt-5 space-y-5">
      <AdminErrorBanner message={rag.error || csvError} className="m-0" />

      <div className="flex items-center gap-3 rounded-[13px] border border-[#BFE9DA] bg-[#EEFBF7] px-5 py-4 text-[12px] text-[#475467]">
        <FileText size={17} className="shrink-0 text-[#439A97]" />
        <p>집계 데이터는 기능 배포 이후 생성된 대화부터 반영됩니다. 차단 및 상담원 연결 응답은 집계에서 제외됩니다.</p>
      </div>

      <section aria-label="RAG 분석 기간 검색" className="rounded-[16px] border border-[#E7EAF0] bg-white px-6 py-5 shadow-[0_3px_12px_rgba(16,24,40,0.05)]">
        <form onSubmit={(event) => { event.preventDefault(); rag.applySearch({ from: startDate, to: endDate }); }} className="flex flex-wrap items-center gap-3">
          <label htmlFor="rag-start-date" className="text-[13px] font-semibold text-[#475467]">기간</label>
          <input id="rag-start-date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="h-9 w-[140px] rounded-[10px] border border-[#DDE2E8] px-3 text-[12px] text-[#667085] outline-none focus:border-[#439A97]" />
          <span className="text-[#98A2B3]">~</span>
          <input aria-label="RAG 분석 종료일" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="h-9 w-[140px] rounded-[10px] border border-[#DDE2E8] px-3 text-[12px] text-[#667085] outline-none focus:border-[#439A97]" />
          <button type="submit" className="h-9 rounded-[10px] bg-[#439A97] px-5 text-[12px] font-semibold text-white">조회</button>
          <button type="button" onClick={handleReset} className="h-9 rounded-[10px] border border-[#DDE2E8] bg-white px-5 text-[12px] font-semibold text-[#667085]">초기화</button>
          <span className="text-[12px] text-[#98A2B3]">기간 미선택 시 전체 기간 조회</span>
        </form>
      </section>

      <section className="rounded-[16px] border border-[#E7EAF0] bg-white px-6 py-6 shadow-[0_3px_12px_rgba(16,24,40,0.05)]">
        <h2 className="text-[15px] font-bold text-[#111827]">채택 빈도 TOP 10</h2>
        <p className="mt-1 text-[12px] text-[#98A2B3]">근거로 가장 많이 채택된 규정 문서 · 페이지 상위 10개</p>

        <div className="mt-6 min-h-[120px]">
          {rag.isLoading ? (
            <p className="py-10 text-center text-[13px] text-[#98A2B3]">차트를 불러오는 중입니다...</p>
          ) : topStats.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-[#98A2B3]">집계된 RAG 채택 데이터가 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[640px] space-y-3">
                {topStats.map((stat, index) => (
                  <div key={`${stat.source}-${stat.page ?? "none"}-${index}`} className="grid grid-cols-[180px_1fr] items-center gap-4">
                    <p className="truncate text-right text-[11px] text-[#667085]" title={`${stat.source}${stat.page ? ` · ${stat.page}p` : ""}`}>
                      <span className="mr-1 font-semibold text-[#98A2B3]">{index + 1}.</span>
                      {stat.source}{stat.page ? ` · ${stat.page}p` : ""}
                    </p>
                    <div className="relative h-5 overflow-hidden rounded-[4px] bg-[#F4F6F8]">
                      <div
                        className={`flex h-full items-center rounded-r-[4px] ${index < 3 ? "bg-[#439A97]" : "bg-[#A8D5C8]"}`}
                        style={{ width: `${topMaxCount > 0 ? Math.max((stat.count / topMaxCount) * 100, 2) : 0}%` }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#475467]">{stat.count}회</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-[16px] border border-[#E7EAF0] bg-white shadow-[0_3px_12px_rgba(16,24,40,0.05)]">
        <header className="flex items-center justify-between border-b border-[#E7EAF0] px-6 py-5">
          <div>
            <h2 className="text-[15px] font-bold text-[#111827]">규정 문서 채택 빈도</h2>
            <p className="mt-1 text-[12px] text-[#98A2B3]">문서 · 페이지별 채택 횟수 (높은 순)</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[12px] text-[#98A2B3]">총 {totalElements}개</p>
            <button type="button" onClick={handleDownload} disabled={isDownloading} className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-[#DDE2E8] px-3 text-[12px] font-semibold text-[#475467] disabled:cursor-not-allowed disabled:opacity-60">
              <Download size={14} />
              {isDownloading ? "다운로드 중..." : "CSV 다운로드"}
            </button>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] table-fixed border-collapse text-left">
            <thead className="bg-[#F8FAFC] text-[12px] font-semibold text-[#667085]">
              <tr>
                <th className="w-[70px] px-5 py-4">순위</th>
                <th className="w-[28%] px-5 py-4">문서명</th>
                <th className="w-[20%] px-5 py-4">페이지</th>
                <th className="w-[100px] px-5 py-4">채택 횟수</th>
                <th className="px-5 py-4">비중</th>
              </tr>
            </thead>
            <tbody>
              {rag.isLoading ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center text-[14px] text-[#98A2B3]">RAG 채택 빈도를 불러오는 중입니다...</td></tr>
              ) : content.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-20 text-center text-[14px] text-[#98A2B3]">집계된 RAG 채택 데이터가 없습니다.</td></tr>
              ) : content.map((stat, index) => {
                const rank = page * size + index + 1;
                const barWidth = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;

                return (
                  <tr key={`${stat.source}-${stat.page ?? "none"}-${index}`} className="border-t border-[#EEF0F3] text-[13px] text-[#344054]">
                    <td className={`px-5 py-4 font-semibold ${rank <= 3 ? "text-[#439A97]" : "text-[#98A2B3]"}`}>#{rank}</td>
                    <td className="px-5 py-4 font-semibold text-[#111827]">{stat.source}</td>
                    <td className={`px-5 py-4 ${stat.page ? "text-[#344054]" : "text-[#C2C8D0]"}`}>{stat.page ? `${stat.page}페이지` : "페이지 정보 없음"}</td>
                    <td className="px-5 py-4 font-semibold text-[#439A97]">{stat.count}회</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEF0F3]"><div className={`h-full rounded-full ${rank <= 3 ? "bg-[#439A97]" : "bg-[#A8D5C8]"}`} style={{ width: `${barWidth}%` }} /></div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PageNav page={page} totalPages={totalPages} first={first} last={last} onChange={rag.setPage} />
      </section>
    </div>
  );
}

function PageNav({
  page,
  totalPages,
  first,
  last,
  onChange,
}: {
  page: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  onChange: (page: number) => void;
}) {
  return (
    <footer className="flex items-center justify-between border-t border-[#E7EAF0] px-5 py-4">
      <span className="text-[12px] text-[#98A2B3]">{page + 1}/{totalPages} 페이지</span>
      <div className="flex items-center gap-2 text-[12px]">
        <button type="button" disabled={first} onClick={() => onChange(page - 1)} className="rounded-[7px] border border-[#EEF0F3] px-3 py-2 text-[#667085] disabled:cursor-not-allowed disabled:text-[#C4C9D1]">이전</button>
        <span className="flex h-8 min-w-8 items-center justify-center rounded-[7px] bg-[#439A97] px-2 font-semibold text-white">{page + 1}</span>
        <button type="button" disabled={last} onClick={() => onChange(page + 1)} className="rounded-[7px] border border-[#EEF0F3] px-3 py-2 text-[#667085] disabled:cursor-not-allowed disabled:text-[#C4C9D1]">다음</button>
      </div>
    </footer>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`relative px-5 pb-4 text-[14px] font-semibold ${active ? "text-[#439A97] after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-[#439A97]" : "text-[#475467]"}`}>{children}</button>;
}

function StatusBadge({ filtered }: { filtered: boolean }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${filtered ? "bg-[#FEE4E2] text-[#F04438]" : "bg-[#DDF4E8] text-[#3AA477]"}`}>{filtered ? "차단" : "정상"}</span>;
}

function LogDetailModal({ log, onClose }: { log: AdminChatLog; onClose: () => void }) {
  const { date, time } = formatLogDateTime(log.createdAt);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 px-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="chatbot-log-detail-title" className="w-full max-w-[620px] rounded-[20px] bg-white p-7 shadow-[0_24px_70px_rgba(16,24,40,0.24)]">
        <header className="flex items-start justify-between"><div><h2 id="chatbot-log-detail-title" className="text-[20px] font-bold text-[#111827]">대화 로그 상세</h2><p className="mt-1 text-[13px] text-[#98A2B3]">#{log.chatLogId} · {date} {time}</p></div><button type="button" onClick={onClose} aria-label="상세 창 닫기" className="rounded-full p-2 text-[#667085] hover:bg-[#F2F4F7]"><X size={20} /></button></header>
        <dl className="mt-6 space-y-5 text-[14px]"><div><dt className="font-semibold text-[#667085]">작성자</dt><dd className="mt-2 text-[#111827]">{getAuthorName(log)} <span className="text-[#98A2B3]">(회원 #{log.userId})</span></dd></div><div><dt className="font-semibold text-[#667085]">질문</dt><dd className="mt-2 rounded-[12px] bg-[#F8FAFC] p-4 leading-6 text-[#111827]">{log.question}</dd></div><div><dt className="font-semibold text-[#667085]">답변</dt><dd className="mt-2 rounded-[12px] bg-[#F8FAFC] p-4 leading-6 text-[#475467]">{log.answer}</dd></div><div className="flex items-center gap-3"><dt className="font-semibold text-[#667085]">처리 유형</dt><dd><StatusBadge filtered={log.filtered} /></dd></div></dl>
        <button type="button" onClick={onClose} className="mt-7 h-11 w-full rounded-[12px] bg-[#439A97] text-[14px] font-semibold text-white">확인</button>
      </section>
    </div>
  );
}
