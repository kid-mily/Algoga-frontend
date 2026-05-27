interface Props {
    onClose: () => void;
}

export default function CanclelationPolicyModal({ onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            {/* 모달 창 */}
            <div className="relative w-full max-w-3xl bg-white rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
                
                {/* 닫기 버튼 */}
                <button onClick={onClose} className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-gray-600">
                    ✕
                </button>
                
                {/* 제목 */}
                <div className="border-b border-[#EEF1F5] pb-5">
                    <h1 className="text-3xl font-bold text-[#0A1628]">환불 정책</h1>
                </div>
                
                {/* 내용 */}
                <div className="mt-8">
                    
                    {/* 1 */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#CBEDD5] text-[#439A97] flex items-center justify-center font-bold">1</div>
                            <h1 className="text-xl font-bold text-[#0A1628]">환불 가능 기간</h1>
                        </div>
                        <div className="mt-4 bg-[#F8FAFD] border border-[#E5EAF2] rounded-3xl p-6">
                            <ul className="space-y-4 text-[#4B5563] leading-relaxed">
                                <li>• <b>강의</b>: 결제일로부터 7일 이내, 강의 수강 진도율 10% 미만인 경우 전액 환불 가능</li>
                                <li>• <b>패키지(예약금):</b> 출발일 기준 30일 전까지 전액 환불</li>
                                <li>• <b>패키지(잔금):</b> 출발일 기준 7일 전까지 환불 가능</li>
                            </ul>
                        </div>
                    </div>

                    {/* 2 */}
                    <div>
                        <div className="flex items-center gap-3 mt-5">
                            <div className="w-8 h-8 rounded-full bg-[#CBEDD5] text-[#439A97] flex items-center justify-center font-bold">2</div>
                            <h3 className="text-xl font-bold text-[#0A1628]">환불 수수료</h3>
                        </div>
                        <div className="mt-4 bg-[#F8FAFD] border border-[#E5EAF2] rounded-3xl p-6">
                            <ul className="space-y-4 text-[#4B5563] leading-relaxed">
                                <li>• 출발일 기준 <b>30일 전:</b> 환불 수수료 없음</li>
                                <li>• 출발일 기준 <b>29~15일 전:</b> 결제 금액의 10%</li>
                                <li>• 출발일 기준 <b>14~8일 전:</b> 결제 금액의 30%</li>
                                <li>• 출발일 기준 <b>7일 이내:</b> 환불 불가</li>
                            </ul>
                        </div>
                    </div>

                    {/* 3 */}
                    <div>
                        <div className="flex items-center gap-3 mt-5">
                            <div className="w-8 h-8 rounded-full bg-[#CBEDD5] text-[#439A97] flex items-center justify-center font-bold">3</div>
                            <h3 className="text-xl font-bold text-[#0A1628]">쿠폰 및 마일리지 환불 정책</h3>
                        </div>
                            <ul className="space-y-4 mt-5 bg-[#FFF8E8] border border-[#F6C453] rounded-2xl p-5 text-sm text-[#D48806] leading-relaxed">
                                <b>⚠ 쿠폰</b>
                                <li>환불 시 사용한 쿠폰은 <b>재발급되지 않으며</b> 복구가 불가능합니다. 환불 금액은 쿠폰 할인이 적용되기 전
                                    원금에서 환불 수수료를 공제한 금액입니다.</li>
                            </ul>
                            <ul className="space-y-4 mt-5 bg-[#E0F2FE] border border-[#0EA5E9] rounded-2xl p-5 text-sm text-[#0EA5E9] leading-relaxed">
                                <b>✓ 마일리지</b>
                                <li>환불 시 결제에 사용한 마일리지는 <b>전액 반환</b>됩니다. 반환된 마일리지는 즉시 계정에 재적립되어
                                    다시 사용하실 수 있습니다.</li>
                            </ul>
                    </div>

                    {/* 4 */}
                    <div>
                        <div className="flex items-center gap-3 mt-5">
                            <div className="w-8 h-8 rounded-full bg-[#CBEDD5] text-[#439A97] flex items-center justify-center font-bold">4</div>
                            <h3 className="text-xl font-bold text-[#0A1628]">환불 불가 조건</h3>
                        </div>
                        <div className="mt-4 bg-[#FEF2F2] border border-[#FFC9C9] rounded-3xl p-6">
                            <ul className="space-y-4 text-[#E7000B] leading-relaxed">
                                <li>강의 수강 진도율이<b>10% 이상</b>인 경우</li>
                                <li>결제일로부터 <b>7일 이상</b> 경과한 경우 (강의)</li>
                                <li>출발일 기준 <b>7일 이내</b>인 경우 (패키지)</li>
                                <li>이미 여행을 <b>시작</b>한 경우 (패키지)</li>
                            </ul>
                        </div>
                    </div>

                    {/* 5 */}
                    <div>
                        <div className="flex items-center gap-3 mt-5">
                            <div className="w-8 h-8 rounded-full bg-[#CBEDD5] text-[#439A97] flex items-center justify-center font-bold">5</div>
                            <h3 className="text-xl font-bold text-[#0A1628]">환불 처리 기간</h3>
                        </div>
                        <div className="mt-4 bg-[#F8FAFD] border border-[#E5EAF2] rounded-3xl p-6">
                            <ul className="space-y-4 text-[#4B5563] leading-relaxed">
                                <li>• <b>신용카드:</b> 환불 신청일로부터 3~5 영업일 (카드사 정책에 따라 상이)</li>
                                <li>• <b>계좌 이체:</b> 환불 신청일로부터 2~3 영업일</li>
                                <li>• <b>카카오페이:</b> 환불 신청일로부터 1~2 영업일</li>
                            </ul>
                        </div>
                    </div>
            </div>

                {/* 확인 버튼 */}
                <button onClick={onClose} className="w-full h-16 rounded-2xl bg-[#439A97] text-white font-bold mt-10 hover:bg-[#1F5F63] transition-colors">
                    확인
                </button>

            </div>
        </div>
    );
}