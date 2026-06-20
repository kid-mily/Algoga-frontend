"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, ChangeEvent, useEffect, useState } from "react";
import AdminErrorBanner from "@/features/common/AdminErrorBanner";
import { getAdminUsers } from "@/features/services/adminUserActivity.service";
import { AdminUserSummary } from "@/features/csadmin/user/types";
import UserActivityPagination from "./UserActivityPagination";

export default function UserActivityListClient() {
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAdminUsers(
          currentPage,
          10,
          searchKeyword,
          controller.signal
        );

        if (controller.signal.aborted) return;

        setUsers(data.items);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalElements);
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;

        setUsers([]);
        setTotalPages(1);
        setTotalCount(0);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "유저 목록을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      controller.abort();
    };
  }, [currentPage, searchKeyword]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleSearchKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
        <form
          role="search"
          className="flex items-center gap-3"
          onSubmit={handleSearchSubmit}
        >
          <label className="flex h-[44px] flex-1 items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
            <span className="sr-only">유저 검색</span>
            <Image
              src="/images/search.svg"
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
            />

            <input
              type="search"
              value={searchKeyword}
              onChange={handleSearchKeywordChange}
              placeholder="회원 ID, 닉네임, 이메일 검색"
              className="w-full text-[14px] outline-none placeholder:text-[#98A2B3]"
            />
          </label>
        </form>
      </section>

      <AdminErrorBanner message={error} className="mb-4" />

      <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
        <div className="flex items-center justify-between border-b border-[#EEF0F3] px-6 py-4">
          <h2 className="text-[18px] font-bold text-[#111827]">유저 목록</h2>
          <p className="text-[14px] font-semibold text-[#667085]">
            총 {totalCount.toLocaleString()}명
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse">
            <caption className="sr-only">CS 관리자 유저 활동 목록</caption>
            <thead>
              <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-left text-[14px] font-semibold text-[#344054]">
                <th scope="col" className="w-[160px] px-6 py-4">회원 ID</th>
                <th scope="col" className="w-[170px] px-6 py-4">닉네임</th>
                <th scope="col" className="px-6 py-4">이메일</th>
                <th scope="col" className="w-[160px] px-6 py-4">가입일</th>
                <th scope="col" className="w-[120px] px-6 py-4">게시글 수</th>
                <th scope="col" className="w-[120px] px-6 py-4">댓글 수</th>
                <th scope="col" className="w-[120px] px-6 py-4">친구 수</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#667085]">
                    유저 목록을 불러오는 중입니다...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#667085]">
                    유저 목록이 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.userId}
                    className="border-b border-[#EEF0F3] text-[14px] text-[#344054] last:border-b-0"
                  >
                    <td className="px-6 py-5 font-semibold">
                      <Link href={`/csadmin/user/${user.userId}/post`} className="hover:text-[#439A97]">
                        {user.displayId}
                      </Link>
                    </td>
                    <td className="px-6 py-5 font-bold text-[#111827]">
                      <Link href={`/csadmin/user/${user.userId}/post`} className="hover:text-[#439A97]">
                        {user.nickname}
                      </Link>
                    </td>
                    <td className="truncate px-6 py-5">{user.email}</td>
                    <td className="px-6 py-5 text-[#667085]">{user.createdAt}</td>
                    <td className="px-6 py-5">{user.postCount.toLocaleString()}</td>
                    <td className="px-6 py-5">{user.commentCount.toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <Link
                        href={`/csadmin/user/${user.userId}/friend`}
                        className="font-semibold hover:text-[#439A97]"
                        aria-label={`${user.nickname} 친구 목록 보기`}
                      >
                        {user.friendCount.toLocaleString()}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <UserActivityPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
        />
      </section>
    </>
  );
}
