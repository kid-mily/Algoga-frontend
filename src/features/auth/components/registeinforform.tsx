"use client";

import { useState } from "react";

interface RegisterInfoFormProps {
  onNext: () => void;
}

export default function RegisterInfoForm({
  onNext,
}: RegisterInfoFormProps) {

  // 성별
  const [gender, setGender] = useState("");

  // 유입 경로
  const [route, setRoute] = useState("");

  return (
    <div className="mt-3 w-full rounded-[35px] bg-white p-8 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      
      {/* 제목 */}
      <h2 className="text-[25px] font-bold text-[#111827]">
        기본 정보 입력
      </h2>

      {/* 2칸 grid */}
      <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4">

        {/* 이름 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">
            성명 *
          </label>

          <input
            type="text"
            placeholder="홍길동"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 아이디 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">
            아이디 *
          </label>

          <input
            type="text"
            placeholder="아이디 입력"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">
            비밀번호 *
          </label>

          <input
            type="password"
            placeholder="8자 이상"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3]"
          />

          <p className="mt-3 text-[13px] text-[#98A2B3]">
            최소 8자 이상 / 영문, 숫자 포함
          </p>
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">
            비밀번호 확인 *
          </label>

          <input
            type="password"
            placeholder="재입력"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 이메일 */}
        <div className="col-span-2">
          <label className="text-[16px] font-semibold text-[#111827]">
            이메일 *
          </label>

          <input
            type="email"
            placeholder="example@algoga.com"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 전화번호 */}
        <div className="col-span-2">
          <label className="text-[16px] font-semibold text-[#111827]">
            전화번호 *
          </label>

          <input
            type="text"
            placeholder="010-0000-0000"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 생년월일 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">
            생년월일 *
          </label>

          <input
            type="date"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
          />
        </div>

        {/* 성별 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">
            성별 *
          </label>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
          >
            <option value="">
              선택해주세요
            </option>

            <option value="male">
              남자
            </option>

            <option value="female">
              여자
            </option>
          </select>
        </div>

        {/* 추천인 코드 */}
        <div>
          <label className="text-[16px] font-semibold text-[#111827]">
            추천인 코드 (선택)
          </label>

          <input
            type="text"
            placeholder="추천인 코드 입력"
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3]"
          />
        </div>

        {/* 빈 공간 */}
        <div />

        {/* 유입 경로 */}
        <div className="col-span-2">
          <label className="text-[16px] font-semibold text-[#111827]">
            유입 경로 (선택)
          </label>

          <select
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none"
          >
            <option value="">
              선택해주세요
            </option>

            <option value="search">
              검색 엔진
            </option>

            <option value="social">
              소셜 미디어
            </option>

            <option value="friend">
              지인 추천
            </option>

            <option value="ad">
              광고
            </option>

            <option value="etc">
              기타
            </option>
          </select>

          {/* 기타 선택 시 input 등장 */}
          {route === "etc" && (
            <input
              type="text"
              placeholder="유입 경로를 입력해주세요"
              className="mt-3 h-[35px] w-full rounded-[16px] border border-[#D0D5DD] bg-[#F9FAFB] px-5 text-[15px] outline-none placeholder:text-[#98A2B3]"
            />
          )}
        </div>
      </div>

      {/* 다음 버튼 */}
      <button
        type="button"
        onClick={onNext}
        className="mt-8 h-[43px] w-full rounded-[18px] bg-[#439A97] text-[18px] font-semibold text-white"
      >
        다음
      </button>
    </div>
  );
}