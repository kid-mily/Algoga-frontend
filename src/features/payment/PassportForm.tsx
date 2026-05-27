"use client";

import { useState } from "react";

export default function PassportForm() {
    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        gender: "",
        birthDate: "",
        nationality: "",
        passportType: "",
        passportNumber: "",
        expiryDate: "",
    });

    const handleSave = () => {
        // 작성 정보 저장 로직
        console.log("저장 데이터:", formData);
    };

    return (
        <div className="w-full space-y-6">
            <div className="relative rounded-2xl bg-white p-8 border border-[#E8EEF5] shadow-sm">
                
                {/* 타이틀 & 저장 버튼 */}
                <div className="flex items-center justify-between border-b border-[#E8EEF5] pb-5">
                    <h3 className="text-lg font-bold text-[#0A1628]">여권 정보 입력</h3>
                    <button
                        onClick={handleSave}
                        className="rounded-full border bg-[#D97724]/5 border-[#D97724] px-4 py-2 text-sm text-[#E85800] hover:bg-[#FFF9E6]"
                    >
                        작성 정보 저장하기
                    </button>
                </div>

                {/* 주의 */}
                <div className="mt-5 rounded-2xl bg-[#EFF4FF] border border-[#D1E0FF] p-4 text-sm leading-relaxed text-[#2970FF]">
                    <p>ℹ️ 여권에 기재된 영문 이름과 동일하게 입력해 주세요.</p>
                    <p>ℹ️ 영문 이름 철자 오류로 인한 탑승 불가 시 책임은 예약자에게 있습니다.</p>
                </div>

                {/* 입력 폼 */}
                <div className="mt-6 space-y-5">
                <div>
                    <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="성"
                        className="w-full rounded-2xl bg-[#F8FBFF] border border-[#E8EEF5] px-4 py-3 text-sm font-medium text-[#0A1628] focus:border-[#2970FF] focus:bg-white focus:outline-none"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="이름"
                        className="w-full rounded-2xl bg-[#F8FBFF] border border-[#E8EEF5] px-4 py-3 text-sm font-medium text-[#0A1628] focus:border-[#2970FF] focus:bg-white focus:outline-none"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    </div>
                    <p className="mt-2 pl-1 text-sm text-[#94A3B8]">
                    여권 영문명과 동일하게 입력해 주세요.
                    </p>
                </div>

                {/* 성별 / 생년월일 / 국가 */}
                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="성별"
                        className="w-full rounded-2xl bg-[#F8FBFF] border border-[#E8EEF5] px-4 py-3 text-sm font-medium text-[#0A1628] focus:border-[#2970FF] focus:bg-white focus:outline-none"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="생년월일"
                        className="w-full rounded-2xl bg-[#F8FBFF] border border-[#E8EEF5] px-4 py-3 text-sm font-medium text-[#0A1628] focus:border-[#2970FF] focus:bg-white focus:outline-none"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    />
                    <input
                    type="text"
                    placeholder="국가"
                    className="w-full rounded-2xl bg-[#F8FBFF] border border-[#E8EEF5] px-4 py-3 text-sm font-medium text-[#0A1628] focus:border-[#2970FF] focus:bg-white focus:outline-none"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    />
                </div>

                {/* 여권구분 / 여권번호 / 만료일 */}
                <div>
                    <div className="grid grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="여권"
                            className="w-full rounded-2xl bg-[#F8FBFF] border border-[#E8EEF5] px-4 py-3 text-sm font-medium text-[#0A1628] focus:border-[#2970FF] focus:bg-white focus:outline-none"
                            value={formData.passportType}
                            onChange={(e) => setFormData({ ...formData, passportType: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="여권 번호"
                            className="w-full rounded-2xl bg-[#F8FBFF] border border-[#E8EEF5] px-4 py-3 text-sm font-medium text-[#0A1628] focus:border-[#2970FF] focus:bg-white focus:outline-none"
                            value={formData.passportNumber}
                            onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="만료일(YYYY-MM-DD)"
                            className="w-full rounded-2xl bg-[#F8FBFF] border border-[#E8EEF5] px-4 py-3 text-sm font-medium text-[#0A1628] focus:border-[#2970FF] focus:bg-white focus:outline-none"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        />
                        </div>
                        <p className="mt-1 pl-1 text-xs font-medium text-[#94A3B8] text-center">
                        여권 번호 및 만료일을 다시 한번 확인해 주세요.
                        </p>
                    </div>
                </div>

                {/* 경고 */}
                <div className="mt-6 rounded-2xl bg-[#FFF5F5] border border-[#FEE2E2] p-3 text-sm font-semibold text-[#D92D20] flex items-center gap-2">
                    ⚠️ 입력 정보를 다시 확인해 주세요.
                </div>
            </div>
        </div>
    );
}