import Image from "next/image";
import Link from "next/link";
import { BlacklistUser } from "../types";

type CandidateTableProps = {
  users: BlacklistUser[];
  isLoading: boolean;
};

type BlacklistedTableProps = {
  users: BlacklistUser[];
  isLoading: boolean;
};

export function CandidateTable({
  users,
  isLoading,
}: CandidateTableProps) {
  return (
    <table className="w-full table-fixed border-collapse">
      <thead>
        <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-bold text-[#344054]">
          <th className="w-[120px] px-5 py-4">회원 ID</th>
          <th className="w-[130px] px-5 py-4">이름</th>
          <th className="w-[150px] px-5 py-4">닉네임</th>
          <th className="px-5 py-4">이메일</th>
          <th className="w-[130px] px-5 py-4">신고 횟수</th>
          <th className="w-[140px] px-5 py-4">최근 신고일</th>
          <th className="w-[160px] px-5 py-4">관리</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <EmptyRow text="블랙리스트 후보를 불러오는 중입니다." />
        ) : users.length === 0 ? (
          <EmptyRow text="블랙리스트 후보가 없습니다." />
        ) : (
          users.map((user) => (
            <tr key={user.userId} className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
              <td className="px-5 py-5 font-semibold">{user.displayId}</td>
              <td className="px-5 py-5 font-bold text-[#111827]">{user.name}</td>
              <td className="px-5 py-5">{user.nickname}</td>
              <td className="px-5 py-5">{user.email}</td>
              <td className="px-5 py-5 font-bold text-[#DC2626]">{user.reportCount}회</td>
              <td className="px-5 py-5 text-[#667085]">{user.lastReportedAt}</td>
              <td className="px-5 py-5">
                <div className="flex items-center">
                  <Link
                    href={`/superadmin/blacklist/${user.userId}`}
                    className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] hover:bg-[#F5F7FA]"
                    aria-label={`${user.name} 상세 보기`}
                  >
                    <Image src="/images/eye.svg" alt="" aria-hidden width={17} height={17} />
                  </Link>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export function BlacklistedTable({
  users,
  isLoading,
}: BlacklistedTableProps) {
  return (
    <table className="w-full table-fixed border-collapse">
      <thead>
        <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[13px] font-bold text-[#344054]">
          <th className="w-[90px] px-4 py-4">유저 ID</th>
          <th className="w-[130px] px-4 py-4">아이디</th>
          <th className="w-[110px] px-4 py-4">이름</th>
          <th className="w-[120px] px-4 py-4">닉네임</th>
          <th className="px-5 py-4">이메일</th>
          <th className="w-[110px] px-4 py-4">신고 횟수</th>
          <th className="w-[130px] px-4 py-4">최근 신고일</th>
          <th className="w-[140px] px-4 py-4">블랙리스트 여부</th>
          <th className="w-[80px] px-4 py-4">관리</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <EmptyRow colSpan={9} text="블랙리스트 목록을 불러오는 중입니다." />
        ) : users.length === 0 ? (
          <EmptyRow colSpan={9} text="등록된 블랙리스트가 없습니다." />
        ) : (
          users.map((user) => (
            <tr key={user.userId} className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0">
              <td className="px-4 py-5 font-semibold">{user.userId}</td>
              <td className="px-4 py-5">
                <span className="block truncate">{user.username}</span>
              </td>
              <td className="px-4 py-5 font-bold text-[#111827]">
                <span className="block truncate">{user.name}</span>
              </td>
              <td className="px-4 py-5">
                <span className="block truncate">{user.nickname}</span>
              </td>
              <td className="px-5 py-5">
                <span className="block truncate">{user.email}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-5 font-bold text-[#DC2626]">{user.reportCount}회</td>
              <td className="whitespace-nowrap px-4 py-5 text-[#667085]">{user.lastReportedAt}</td>
              <td className="px-4 py-5">
                <span
                  className={`inline-flex h-[30px] items-center rounded-full px-3 text-[12px] font-bold ${
                    user.isBlacklisted
                      ? "bg-[#FEE4E2] text-[#D92D20]"
                      : "bg-[#ECFDF3] text-[#027A48]"
                  }`}
                >
                  {user.isBlacklisted ? "등록됨" : "미등록"}
                </span>
              </td>
              <td className="px-4 py-5">
                <div className="flex items-center">
                  <Link
                    href={`/superadmin/blacklist/${user.userId}`}
                    className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] hover:bg-[#F5F7FA]"
                    aria-label={`${user.name} 상세 보기`}
                  >
                    <Image src="/images/eye.svg" alt="" aria-hidden width={17} height={17} />
                  </Link>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

function EmptyRow({ text, colSpan = 7 }: { text: string; colSpan?: number }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        role="status"
        aria-live="polite"
        className="px-5 py-12 text-center text-[14px] text-[#667085]"
      >
        {text}
      </td>
    </tr>
  );
}
