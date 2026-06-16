"use client";

import Link from "next/link";

const users = [
  {
    userId: 1,
    displayId: "U001",
    nickname: "김여행",
    email: "travel@algoga.kr",
    joinedAt: "2024.01.15",
    posts: 24,
    comments: 156,
    friends: 38,
  },
  {
    userId: 2,
    displayId: "U002",
    nickname: "이투어",
    email: "tour@algoga.kr",
    joinedAt: "2024.02.20",
    posts: 18,
    comments: 92,
    friends: 25,
  },
  {
    userId: 3,
    displayId: "U003",
    nickname: "박트립",
    email: "trip@algoga.kr",
    joinedAt: "2024.03.10",
    posts: 32,
    comments: 204,
    friends: 47,
  },
  {
    userId: 4,
    displayId: "U004",
    nickname: "최여행",
    email: "yeohaeng@algoga.kr",
    joinedAt: "2024.04.05",
    posts: 15,
    comments: 78,
    friends: 19,
  },
  {
    userId: 5,
    displayId: "U005",
    nickname: "정트래블",
    email: "traveler@algoga.kr",
    joinedAt: "2024.05.12",
    posts: 41,
    comments: 287,
    friends: 62,
  },
];

export default function UserActivityListClient() {
  return (
    <>
      <section className="mb-6 rounded-[16px] border border-[#E4E7EC] bg-white p-4">
        <form role="search" className="flex items-center gap-3">
          <button
            type="button"
            aria-label="유저 필터"
            className="h-[60px] w-[72px] rounded-[10px] border border-[#E4E7EC] bg-white"
          />

          <label className="flex h-[44px] flex-1 items-center gap-3 rounded-[10px] border border-[#E4E7EC] px-4">
            <span className="sr-only">유저 검색</span>
            <img
              src="/images/search.svg"
              alt=""
              aria-hidden="true"
              className="h-[18px] w-[18px]"
            />

            <input
              type="text"
              placeholder="검색..."
              className="w-full text-[14px] outline-none placeholder:text-[#98A2B3]"
            />
          </label>
        </form>
      </section>

      <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white">
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
              {users.map((user) => (
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
                  <td className="px-6 py-5 text-[#667085]">{user.joinedAt}</td>
                  <td className="px-6 py-5">{user.posts}</td>
                  <td className="px-6 py-5">{user.comments}</td>
                  <td className="px-6 py-5">{user.friends}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
